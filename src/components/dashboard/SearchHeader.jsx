const SearchHeader = ({
    placeholder = "Zoek...",
    value = "",
    onChange,
    helperText,
    rightContent = null,
}) => {
    const handleChange = (event) => {
        onChange?.(event.target.value);
    };

    return (
        <div className="bg-[#ef4d16] px-10 py-4 search-header">
            <div className="grid grid-cols-3 gap-4 items-center">
                <div className="col-span-1 flex flex-col">
                    <input
                        type="text"
                        value={value}
                        onChange={handleChange}
                        placeholder={placeholder}
                        className="w-full px-3 py-2 rounded-md border border-transparent focus:border-[#ffb699] focus:ring-2 focus:ring-[#ffb699]/60 outline-none transition-shadow shadow-sm"
                    />
                    {helperText && (
                        <span className="text-xs text-white/80 mt-1">{helperText}</span>
                    )}
                </div>
                <div className="col-span-2 text-white flex justify-end">
                    {rightContent}
                </div>
            </div>
        </div>
    );
};

export default SearchHeader;
