export const getNextTestResultIdentifier = () => {
    let lastId = 0;
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith('testResult_')) {
            const id = parseInt(key.replace('testResult_', ''));
            if (!isNaN(id) && id > lastId) {
                lastId = id;
            }
        }
    }
    return `testResult_${lastId + 1}`;
};