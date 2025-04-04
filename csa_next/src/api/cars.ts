const BASE_URL = process.env.NEXT_PUBLIC_DATABASE_IP || "http://localhost:4000";
const apiBase = `${BASE_URL}/api/v1/cars`;

async function apiCall(endpoint: string, { method = 'GET', body, query, headers }: ApiCallOptions = {}) {
    let url = `${apiBase}/${endpoint}`;
    
    // Make query string
    if (query && Object.keys(query).length > 0) {
        const queryParams = new URLSearchParams();
        for (const [key, value] of Object.entries(query)) {
            if (value !== undefined && value !== null) {
                queryParams.append(key, String(value));
            }
        }
        url += `?${queryParams.toString()}`;
    }

    let fetchOptions: RequestInit = {
        method,
        credentials: 'include',
    };

    // If body is FormData, don't add JSON headers or stringify
    if (body instanceof FormData) {
        fetchOptions.body = body;
    } else if (body) {
        fetchOptions.headers = {
            'Content-Type': 'application/json',
            ...(headers || {})
        };
        fetchOptions.body = JSON.stringify(body);
    } else if (headers) {
        fetchOptions.headers = headers;
    }

    const response = await fetch(url, fetchOptions);
    return response.json();
}

export async function get_models(make?: string, query?: string) {
    return apiCall(`makes/${make || 'unknown'}/models/${query || ''}`);
}

export async function get_makes(query?: string) {
    return apiCall(`makes/${query || ''}`);
}

export async function add_make(make: string) {
    return apiCall('addmake', {
        method: 'POST',
        body: { make }
    });
}

export async function add_model(make: string, model: string) {
    return apiCall('addmodel', {
        method: 'POST',
        body: { make, model }
    });
}

export async function add_tag(tag: string) {
    return apiCall('addtag', {
        method: 'POST',
        body: { tag }
    });
}

export async function get_tags() {
    return apiCall('tags');
}

export async function regnr_info(regnr: string) {
    return apiCall(`regnr/${regnr}`);
}

export async function upload_spot(
    make: string, 
    model: string, 
    images: File[], 
    notes?: string, 
    date?: string, 
    tags?: string[]
) {
    const formData = new FormData();
    formData.append('make', make);
    formData.append('model', model);

    images.forEach(image => {
        formData.append('images', image);
    });

    if (tags) tags.forEach(tag => formData.append('tags', tag));
    if (notes) formData.append('notes', notes);
    if (date) formData.append('date', date);

    return apiCall('addspot', {
        method: 'POST',
        body: formData
    });
}

interface UploadData {
    make: string;
    model: string;
    files: File[];
    notes?: string;
    date?: string;
    tags?: string[];
}

export async function startBackgroundUpload(
    registration: ServiceWorkerRegistration, 
    data: UploadData
) {
    const { make, model, files, notes, date, tags } = data;
    const formData = new FormData();
    formData.append('make', make);
    formData.append('model', model);
    files.forEach(file => formData.append('images', file));
    if (tags) tags.forEach(tag => formData.append('tags', tag));
    if (notes) formData.append('notes', notes);
    if (date) formData.append('date', date);

    const request = new Request(`${apiBase}/addspot`, {
        method: 'POST',
        credentials: 'include',
        body: formData
    });

    try {
        const bgFetch = await (registration as any).backgroundFetch.fetch('my-upload-id', [request], {
            title: 'Uploading your files',
            icons: [{ src: '/icon.png', sizes: '192x192', type: 'image/png' }],
            downloadTotal: files.reduce((acc, file) => acc + file.size, 0),
        });
        
        // handled by service worker
    } catch (error) {
        console.error('Background fetch registration failed:', error);
        // Fallback to normal upload
        return upload_spot(make, model, files, notes, date, tags);
    }
}

export async function edit_spot(
    make: string, 
    model: string, 
    key: string, 
    notes: string, 
    date: string, 
    tags?: string[]
) {
    return apiCall('editspot', {
        method: 'POST',
        body: { make, model, key, notes, date, tags }
    });
}

export async function like_spot(make: string, model: string, key: string, user: string) {
    return apiCall('likespot', {
        method: 'POST',
        body: { make, model, key, user }
    });
}

export async function delete_spot(make: string, model: string, key: string) {
    return apiCall('deletespot', {
        method: 'POST',
        body: { make, model, key }
    });
}

export async function get_spotted_makes(query?: string, username?: string) {
    return apiCall(`spots/makes/${query || ''}`, {
        query: { username }
    });
}

export async function get_spotted_models(make?: string, query?: string, username?: string) {
    return apiCall(`spots/makes/${make || 'unknown'}/models/${query || ''}`, {
        query: { username }
    });
}

export async function get_spotted_make_percentage(make: string, username?: string) {
    return apiCall(`spots/${make}/percentage`, {
        query: { username }
    });
}

export async function get_spotted_images(make: string, model: string, username?: string) {
    const data = await apiCall(`getspots/${encodeURIComponent(make)}/${encodeURIComponent(model)}`, {
        query: { username }
    });

    return data.map((item: any) => {
        const urlArr = item.images.map((img: string) => img ? `data:image/jpeg;base64,${img}` : null);
        return { key: item.key, urlArr, notes: item.notes, date: item.date, tags: item.tags };
    });
}

export async function get_comments(username: string, make: string, model: string, key: string) {
    const spotKey = `${username}:${make}:${model}:${key}`;

    return apiCall(`getcomments/${spotKey}`);
}

export async function add_comment(
    username: string, 
    make: string, 
    model: string, 
    key: string, 
    comment: string, 
    parentId?: string
) {
    const spotKey = `${username}:${make}:${model}:${key}`;

    return apiCall('addcomment', {
        method: 'POST',
        body: { key: spotKey, comment, parentId }
    });
}

export async function delete_comment(
    username: string, 
    make: string, 
    model: string, 
    key: string, 
    commentId: string
) {
    const spotKey = `${username}:${make}:${model}:${key}`;

    return apiCall('deletecomment', {
        method: 'POST',
        body: { key: spotKey, commentId }
    });
}

export async function like_comment(key: string, commentId: string) {
    return apiCall('likecomment', {
        method: 'POST',
        body: { key, commentId }
    });
}

export async function discover(page?: number, sort?: 'recent' | 'hot' | 'top', search?: string) {
    return apiCall('discover', { query: { page, sort, search } });
}

export async function search_autocomplete(query: string) {
    return apiCall('search_autocomplete', { query: { query } });
}

export async function update_spots() {
    return apiCall('updatespots', { method: 'POST' });
}
