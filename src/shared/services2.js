
const serverApi = "http://localhost:4000/";

const GetPersonsCount = async () => {
    return new Promise(async (resolve) => {

        return resolve({ status: true, values: 10 });
        /* let url = `${serverApi}Products/$count`;
        if (query) url = `${serverApi}Products/$count?${query}`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || 0 });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        } */
    })
}

const GetPersons = async () => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}persons/all`;

        try {
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-type": "application/json"
                }
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || 0 });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    })
};

const GetSearch = async (name, filters) => {
    return new Promise(async (resolve) => {
        let url = `${serverApi}${name}/search`;

        try {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify(filters)
            });

            const json = await res.json();
            if (res.status === 200) {
                return resolve({ status: res.ok, values: json || 0 });
            }

            return resolve({ status: false, statusText: json.error.message });

        } catch (error) {
            console.log(error);
            return resolve({ status: false, statusText: error.message });
        }
    })
};

export { GetSearch, GetPersonsCount, GetPersons };