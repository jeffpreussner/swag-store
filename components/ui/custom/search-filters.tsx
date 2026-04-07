"use client";

import { Button } from "@/components/ui/button";
import { Category } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { debounce } from "lodash";
import { ChevronDown, Search } from "lucide-react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function SearchFilters({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const searchTerm = searchParams.get("search");
  const category = searchParams.get("category");

  function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
    auto: boolean = false,
  ) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    const form = e.currentTarget as HTMLFormElement;
    const input = form.querySelector("input") as HTMLInputElement;

    if (input.value.length < 3 && auto === true) return;
    if (input.value) {
      params.set("search", input.value);
    } else {
      params.delete("search");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement>,
    auto: boolean = false,
  ) {
    const params = new URLSearchParams(searchParams.toString());
    if (e.target.value.length < 3 && auto === true) return;
    if (e.target.value) {
      params.set("search", e.target.value);
    } else {
      params.delete("search");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  function handleFacetChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="text-center mb-10">
      <div className="flex flex-col justify-center gap-2 mb-4">
        <form
          className="flex justify-center gap-2"
          onSubmit={(e) => handleSubmit(e)}
        >
          <Input
            placeholder="Search for products..."
            onChange={debounce(
              (e: React.ChangeEvent<HTMLInputElement>) =>
                handleInputChange(e, true),
              300,
            )}
            defaultValue={searchTerm || ""}
          />
          <Button type="submit" aria-label="Search">
            <span className="hidden md:inline">Search </span>
            <Search />
          </Button>
        </form>
        {categories.length > 0 && (
          <div className="flex justify-start">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="default" className="group">
                  Categories{" "}
                  <ChevronDown className="transition-transform group-data-[state=open]:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Categories</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    onValueChange={handleFacetChange}
                    value={category || ""}
                  >
                    {category && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mb-4 w-full text-left px-2 py-1 hover:bg-gray-100"
                        onClick={() => handleFacetChange("")}
                      >
                        Clear selection
                      </Button>
                    )}
                    {categories.map((c) => (
                      <DropdownMenuRadioItem key={c.slug} value={c.slug}>
                        <div className="flex justify-between w-full">
                          <span>{c.name}</span> <Badge>{c.productCount}</Badge>
                        </div>
                      </DropdownMenuRadioItem>
                    ))}
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </div>
  );
}
