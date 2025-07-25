"use client";

import { useEffect, useRef, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { product_api } from "@/api/api";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import debounce from "lodash.debounce";

interface ProductSuggestion {
    _id: string;
    name: string;
    slug: string;
}


const debouncedFetch = debounce(async (q: string, setter: (val: ProductSuggestion[]) => void) => {
    if (!q) return setter([]);
    try {
        const res = await product_api.get(`/products/search/suggestions?q=${q}`);
        setter(res.data || []);
    } catch (err) {
        console.error("Search error:", err);
    }
}, 300);


export default function SearchBar() {
    const [search, setSearch] = useState("");
    const [suggestions, setSuggestions] = useState<ProductSuggestion[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searchHistory, setSearchHistory] = useState<string[]>([]);
    const router = useRouter();
    const pathname = usePathname();
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        debouncedFetch(search, setSuggestions);
    }, [search]);


    // Clear input & dropdown when route changes
    useEffect(() => {
        setSearch("");
        setShowDropdown(false);
    }, [pathname]);

    // Load search history on mount
    useEffect(() => {
        const storedHistory = localStorage.getItem("search-history");
        if (storedHistory) setSearchHistory(JSON.parse(storedHistory));
    }, []);

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Handle form submit
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = search.trim();
        if (trimmed) {
            const updatedHistory = [trimmed, ...searchHistory.filter((item) => item !== trimmed)].slice(0, 7);
            setSearchHistory(updatedHistory);
            localStorage.setItem("search-history", JSON.stringify(updatedHistory));

            router.push(`/search?q=${encodeURIComponent(trimmed)}`);
            setSearch(""); // ✅ Clear input
            setShowDropdown(false);
        }
    };

    return (
        <div className="relative w-full md:w-full max-w-lg" ref={wrapperRef}>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={search}
                    onFocus={() => {
                        if (!search) setShowDropdown(true);
                    }}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setShowDropdown(true);
                    }}
                    placeholder="Search electronics..."
                    className="w-full border-2 border-emerald-500 rounded-md px-4 py-2 pr-12 focus:outline-none"
                />
                <button
                    type="submit"
                    className="absolute right-0 top-0 bottom-0 px-4 bg-emerald-500 rounded-r-md hover:bg-emerald-600 transition-colors"
                >
                    <FaSearch className="text-white" />
                </button>
            </form>

            {showDropdown && (
                <div className="absolute z-50 mt-1 bg-white border border-gray-200 rounded-md w-full shadow-lg">
                    {search ? (
                        suggestions.length > 0 ? (
                            <ul>
                                {suggestions.map((item) => (
                                    <li key={item._id}>
                                        <Link
                                            href={`/products/${item.slug}`}
                                            className="block px-4 py-2 hover:bg-emerald-50 text-sm"
                                            onClick={() => {
                                                setSearch(""); // ✅ Clear input
                                                setShowDropdown(false);
                                            }}
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="px-4 py-2 text-sm text-gray-500">No suggestions found.</div>
                        )
                    ) : (
                        <>
                            {searchHistory.length > 0 && (
                                <div className="px-4 py-2 text-xs text-gray-400">Recent Searches</div>
                            )}
                            <ul>
                                {searchHistory.map((item, index) => (
                                    <li key={index}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setSearch("");
                                                setShowDropdown(false);
                                                router.push(`/search?q=${encodeURIComponent(item)}`);
                                            }}
                                            className="block w-full text-left px-4 py-2 hover:bg-emerald-50 text-sm"
                                        >
                                            {item}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
