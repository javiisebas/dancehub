'use client';

import { cn } from '../utils/cn';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import esLocale from 'i18n-iso-countries/langs/es.json';
import { CheckIcon, ChevronDown, ChevronsUpDown, Globe } from 'lucide-react';
import { useLocale } from 'next-intl';
import React, { forwardRef, useCallback, useEffect, useState } from 'react';
import { CircleFlag } from 'react-circle-flags';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from './command';
import { Popover, PopoverContent, PopoverTrigger } from './popover';

countries.registerLocale(enLocale);
countries.registerLocale(esLocale);

export interface Country {
    alpha2: string;
    alpha3: string | undefined;
    name: string;
}

type BaseCountryDropdownProps = {
    options?: Country[];
    disabled?: boolean;
    placeholder?: string;
    slim?: boolean;
    inline?: boolean;
    className?: string;
};

type SingleCountryDropdownProps = BaseCountryDropdownProps & {
    multiple?: false;
    onChange?: (country: Country) => void;
    defaultValue?: string;
};

type MultipleCountryDropdownProps = BaseCountryDropdownProps & {
    multiple: true;
    onChange: (countries: Country[]) => void;
    defaultValue?: string[];
};

type CountryDropdownProps = SingleCountryDropdownProps | MultipleCountryDropdownProps;

const CountryDropdownComponent = (
    {
        options,
        onChange,
        defaultValue,
        disabled = false,
        placeholder = 'Select a country',
        slim = false,
        inline = false,
        multiple = false,
        className,
        ...props
    }: CountryDropdownProps,
    ref: React.ForwardedRef<HTMLButtonElement>,
) => {
    const locale = useLocale();

    const defaultOptions: Country[] = Object.entries(
        countries.getNames(locale, { select: 'official' }),
    ).map(([alpha2, name]) => ({
        alpha2,
        alpha3: countries.alpha2ToAlpha3(alpha2),
        name,
    }));

    const countryOptions = options || defaultOptions;

    const [open, setOpen] = useState(false);
    const [selectedCountries, setSelectedCountries] = useState<Country[]>([]);

    useEffect(() => {
        if (!defaultValue) {
            if (selectedCountries.length > 0) {
                setSelectedCountries([]);
            }
            return;
        }

        if (multiple && Array.isArray(defaultValue)) {
            const currentValues = selectedCountries.map((c) => c.alpha3);
            const hasChanges =
                defaultValue.length !== currentValues.length ||
                !defaultValue.every((v) => currentValues.includes(v));

            if (hasChanges) {
                const initialCountries = countryOptions?.filter((country) =>
                    defaultValue.includes(country?.alpha3 || country?.alpha2),
                );
                setSelectedCountries(initialCountries || []);
            }
        } else if (!multiple && typeof defaultValue === 'string') {
            const alphaType = defaultValue.length > 2 ? 'alpha3' : 'alpha2';

            if (defaultValue?.toUpperCase() !== selectedCountries[0]?.[alphaType]?.toUpperCase()) {
                const initialCountry = countryOptions?.find(
                    (country) =>
                        country?.[alphaType]?.toUpperCase() === defaultValue?.toUpperCase(),
                );
                setSelectedCountries(initialCountry ? [initialCountry] : []);

                return;
            }
        }
    }, [defaultValue, options, multiple]);

    const handleSelect = useCallback(
        (country: Country) => {
            if (multiple) {
                const newSelection = selectedCountries.some((c) => c.alpha3 === country.alpha3)
                    ? selectedCountries.filter((c) => c.alpha3 !== country.alpha3)
                    : [...selectedCountries, country];

                setSelectedCountries(newSelection);
                (onChange as MultipleCountryDropdownProps['onChange'])?.(newSelection);
            } else {
                setSelectedCountries([country]);
                (onChange as SingleCountryDropdownProps['onChange'])?.(country);
                setOpen(false);
            }
        },
        [onChange, multiple, selectedCountries],
    );

    const triggerClasses = cn(
        'flex h-9 w-full items-center justify-between whitespace-nowrap rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 hover:bg-secondary/80',
        slim === true && 'gap-1 w-min',
        inline && 'rounded-r-none border-r-0 gap-1 pr-1 w-min',
        className,
    );

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger ref={ref} className={triggerClasses} disabled={disabled} {...props}>
                {selectedCountries.length > 0 ? (
                    <div className="flex items-center flex-grow gap-2 overflow-hidden">
                        {multiple ? (
                            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                                {selectedCountries.length} selected
                            </span>
                        ) : (
                            <>
                                <div className="inline-flex items-center justify-center w-4 h-4 shrink-0 overflow-hidden rounded-full">
                                    <CircleFlag
                                        countryCode={selectedCountries[0].alpha2.toLowerCase()}
                                        height={16}
                                    />
                                </div>
                                {slim === false && !inline && (
                                    <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                                        {selectedCountries[0].name}
                                    </span>
                                )}
                            </>
                        )}
                    </div>
                ) : (
                    <span className="flex items-center gap-2">
                        {inline || slim ? <Globe size={16} /> : placeholder}
                    </span>
                )}

                {!inline ? (
                    <ChevronDown size={16} />
                ) : (
                    <ChevronsUpDown size={16} className="text-muted-foreground" />
                )}
            </PopoverTrigger>
            <PopoverContent
                collisionPadding={10}
                side="bottom"
                className="min-w-[--radix-popper-anchor-width] p-0"
            >
                <Command className="w-full max-h-[200px] sm:max-h-[270px]">
                    <CommandList>
                        <div className="sticky top-0 z-10 bg-popover">
                            <CommandInput placeholder="Search country..." />
                        </div>
                        <CommandEmpty>No country found.</CommandEmpty>
                        <CommandGroup>
                            {countryOptions
                                .filter((x) => x.name)
                                .map((option, key: number) => (
                                    <CommandItem
                                        className="flex items-center w-full gap-2 cursor-pointer"
                                        key={key}
                                        onSelect={() => handleSelect(option)}
                                    >
                                        <div className="flex flex-grow space-x-2 overflow-hidden">
                                            <div className="inline-flex items-center justify-center w-5 h-5 shrink-0 overflow-hidden rounded-full">
                                                <CircleFlag
                                                    countryCode={option.alpha2.toLowerCase()}
                                                    height={20}
                                                />
                                            </div>
                                            <span className="overflow-hidden text-ellipsis whitespace-nowrap">
                                                {option.name}
                                            </span>
                                        </div>
                                        <CheckIcon
                                            className={cn(
                                                'ml-auto h-4 w-4 shrink-0',
                                                selectedCountries.some(
                                                    (c) => c.name === option.name,
                                                )
                                                    ? 'opacity-100'
                                                    : 'opacity-0',
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

CountryDropdownComponent.displayName = 'CountryDropdownComponent';

export const CountryDropdown = forwardRef(CountryDropdownComponent);
