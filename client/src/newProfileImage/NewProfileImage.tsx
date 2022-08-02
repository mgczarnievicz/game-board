import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { userUpdateImageUrl } from "../redux/user/slice";

import "./NewProfileImage.css";

library.add(faX);

interface ImgDicType {
    index: number;
    url: string;
    name: string;
}

const IMG_DICTIONARY: Array<ImgDicType> = [
    {
        index: 0,
        url: "/img/Elefante2.png",
        name: "Elephant",
    },
    {
        index: 1,
        url: "../img/Arrdilla.png",
        name: "Squirrel",
    },
    {
        index: 3,
        url: "../img/Conejo.png",
        name: "Rabbit",
    },
    {
        index: 2,
        url: "../img/Camello.png",
        name: "Camel",
    },
    {
        index: 4,
        url: "../img/Elefante.png",
        name: "Elephant",
    },
    {
        index: 5,
        url: require("../img/Oso.png"),
        name: "Bear",
    },
    {
        index: 6,
        url: "../img/Pajaro.png",
        name: "Bird",
    },
    {
        index: 7,
        url: "../img/Pato.png",
        name: "Duck",
    },
    {
        index: 8,
        url: "../img/Perro.png",
        name: "Dog",
    },
    {
        index: 9,
        url: "../img/Perro1.png",
        name: "Dog",
    },
    {
        index: 10,
        url: "../img/Perro2.png",
        name: "Dog",
    },
    {
        index: 11,
        url: "../img/Perro3.png",
        name: "Dog",
    },
    {
        index: 12,
        url: "../img/Rinoceronte.png",
        name: "Rhinoceros",
    },
    {
        index: 13,
        url: "../img/Zorro.png",
        name: "Fox",
    },
    {
        index: 14,
        url: "../img/Zorro1.png",
        name: "Fox",
    },
    {
        index: 15,
        url: "../img/racoon.png",
        name: "Racoon",
    },
    {
        index: 16,
        url: "../img/Loro2.png",
        name: "Parrot",
    },
    {
        index: 17,
        url: "../img/Loro.png",
        name: "Parrot",
    },
];

interface NewProfileImageProp {
    closeImage: Function;
}
export default function NewProfileImage(props: NewProfileImageProp) {
    const dispatch = useDispatch();

    async function imgSelected(index: number) {
        console.log("Index", index);
        console.log(IMG_DICTIONARY[index]);

        try {
            const resp = await fetch("/api/updateImage", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ image_url: IMG_DICTIONARY[index].url }),
            });

            const data = await resp.json();
            console.log("Data from the updateImage", data);

            if (data.status === "Success") {
                console.log("Everything is success!");
                //Update my Global State
                dispatch(userUpdateImageUrl(data.payload.image_url));
            } else {
                // setError(true);
            }
        } catch {
            // setError(true);
        }
        props.closeImage();
    }
    return (
        <div className="newImg-window">
            <div className="new-image-container">
                <div className="newImg-header">
                    <h2>Select A new Image</h2>
                    {/* <p>X</p> */}
                    <FontAwesomeIcon
                        icon="x"
                        onClick={() => props.closeImage()}
                    />
                </div>
                <div className="image-container">
                    {IMG_DICTIONARY.map((each) => {
                        return (
                            <div key={each.index}>
                                <img
                                    onClick={() => {
                                        imgSelected(each.index);
                                    }}
                                    src={each.url || require("../img/Oso.png")}
                                    alt={each.name}
                                ></img>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
