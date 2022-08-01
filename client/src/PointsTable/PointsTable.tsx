import React, { useEffect } from "react";

export default function PointsTable() {
    useEffect(() => {
        /* 
        1. Figure out what is the userId we want to fetch information from.
        2. Make a fetch to server to get data (name, surname, photo, bio.)
        Browser browser to se the rout. -> we have a hook called use Params
        */
        let abort = false;
        if (!abort) {
            // We do the query!
            fetch(`/api/getPointsTable`)
                .then((resp) => resp.json())
                .then((data) => {
                    switch (data.status) {
                    }
                });
        }
        return () => {
            abort = true;
        };
    }, []);
    return <div>PointsTable</div>;
}
