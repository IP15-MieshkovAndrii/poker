export const createRoom = async (data) => {
    try {
        const response = await fetch('http://localhost:3000/rooms', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',
            },
            mode: "cors",
            body: JSON.stringify({
                hostName: data.hostName,
            }),
            referrerPolicy: "no-referrer"
        });
        let id = await response.json();

        return {id, response};
    } catch (error) {
        console.error('Error', error);
    }
};

export const getRoom = async (data) => {
    try {
        const response = await fetch('http://localhost:3000/rooms/data', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                roomID: data.roomID,
                nickname: data.nickname,
            }),
        });
        return response.json();
    } catch (error) {
        console.error('Error', error);
    }
};

export const getHost = async (data) => {
    try {
        const response = await fetch('http://localhost:3000/rooms/hostname', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: data.id,
            }),
        });
        return response.json();
    } catch (error) {
        console.error('Error', error);
    }
};

export const getFirebase = async () => {
    try {
        const response = await fetch('http://localhost:3000/firebase-config');
        return response.json();
    } catch (error) {
        console.error('Error', error);
    }
};
