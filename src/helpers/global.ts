
/** Wraps matched part of the text with an HTML \<b> tag and returns text. */
export const htmlThicken = (text: string, key: string) => {
    if (key.length > 0) {
        const index = text.toLowerCase().indexOf(key.toLowerCase());

        if (index != -1) {
            const source = text.substring(index, index + key.length);

            return text.replace(source, "<b>" + source + "</b>");
        }
    }

    return text;
}