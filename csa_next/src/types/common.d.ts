type SearchParams = {
    searchParams: Promise<{
        [key: string]: string | string[] | undefined 
    }>
}

type CarDetails = {
    make: string;
    model: string;
    confidence: number;
}

type releaseNotesComponent = {
    type: "title" | "text";
    text: string;
}