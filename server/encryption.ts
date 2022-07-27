import bcrypt from "bcryptjs";

const hash = (password: string) => {
    return bcrypt.genSalt().then((salt: string) => {
        return bcrypt.hash(password, salt);
    });
};

const compare = bcrypt.compare;

export { hash, compare };
