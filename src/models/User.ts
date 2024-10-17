export class User {

    protected _firstName: string;
    protected _lastName: string;
    protected _email: string;
    protected _password: string;

    constructor(email: string, firstName: string, lastName: string, password: string) {
        this._firstName = firstName
        this._lastName = lastName
        this._email = email
        this._password= password
    }

    get isLoggedIn() {
        return true
    }

    get firstName() {
        return this._firstName
    }

    get lastName() {
        return this._lastName
    }

    get email() {
        return this._email
    }

}

export class AnonymousUser extends User {

    private static instance: AnonymousUser = new AnonymousUser()

    static getInstance() {
        return AnonymousUser.instance
    }

    private constructor() {
        super('Anonymous', 'Anonymous', 'Anonymous', 'Anonymous')
    }

    get isLoggedIn() {
        return false
    }
}
