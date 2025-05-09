
export function extractEmails(text: string) {
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
        return [...new Set(text.match(emailRegex) || [])];
}

export function extractPhoneNumbers(text: string) {
        const phoneRegex = /(\+\d{1,2}\s?)?(\(\d{3}\)|\d{3})[\s.-]?\d{3}[\s.-]?\d{4}\b/g;
        return [...new Set(text.match(phoneRegex) || [])];
}

export function extractUrls(text: string) {
        const urlRegex = /(\bhttps?:\/\/[^\s]+|\bwww\.[^\s]+)\b/g;
        return [...new Set(text.match(urlRegex) || [])];
}

export function extractHashtags(text: string) {
        const hashtagRegex = /#\w+/g;
        return [...new Set(text.match(hashtagRegex) || [])];
}

export function extractMentions(text: string) {
        const mentionRegex = /@\w+/g;
        return [...new Set(text.match(mentionRegex) || [])];
}

export function extractIPs(text: string) {
        const ipRegex = /\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g;
        return [...new Set(text.match(ipRegex) || [])];
}

export function extractCreditCards(text: string) {
        const ccRegex = /\b(?:\d[ -]*?){13,16}\b/g;
        return [...new Set(text.match(ccRegex) || [])];
}


export function extractTimes(text: string) {
        const timeRegex = /\b([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?\b/g;
        return [...new Set(text.match(timeRegex) || [])];
}


