import path from "path";
import React from "react";
import { useSelector } from "react-redux";
import ProfilePhoto from "../profile/profilePhoto";
import { RootState } from "../redux/reducer";
import { UserAlias } from "../typesClient";

import "./EditProfile.css";

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

export default function EditProfile() {
    const myUser: UserAlias = useSelector((state: RootState) => state.user);

    function imgSelected(index: number) {
        console.log("Index", index);
        console.log(IMG_DICTIONARY[index]);
    }
    return (
        <div>
            EditProfile
            <div>
                <ProfilePhoto user={myUser} />
            </div>
            <input></input>
            <div className="image-container">
                {IMG_DICTIONARY.map((each) => {
                    return (
                        <div>
                            <img
                                onClick={() => {
                                    imgSelected(each.index);
                                }}
                                key={each.index}
                                src={each.url || require("../img/Oso.png")}
                                alt={each.name}
                            ></img>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
