import {directLinkAPI} from "../api/api";

export async function getMultiData(links) {
    const promises = links.map(async (link) => {
        const data = await directLinkAPI.getData(link);
        return data;
    });
    let data = await Promise.all(promises).then(requests => requests.map(request => request.data));
    return data;
}
