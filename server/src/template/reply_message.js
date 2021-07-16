const LOGIN_STATUS = {
    SUCCEED : 0,
    USER_NOT_FOUND: 1,
    PASSWORD_INCORRECT: 2,
    NO_VERIFIED: 3,
}

const  LOGIN = [
    {
        status: 200
    }, 
    {
        status: 401,
        body: { err_code: LOGIN_STATUS['USER_NOT_FOUND'], err_msg: "user not found" }
    },
    {
        status: 401,
        body: { err_code: LOGIN_STATUS['PASSWORD_INCORRECT'], err_msg: "password is incorrect" }
    },
    {
        status: 401,
        body: { err_code: LOGIN_STATUS['NO_VERIFIED'], err_msg: "Check confirm mail first" }
    }
];



const REGISTER_STATUS = {
    SUCCEED : 0,
    DUPLICATED_USER: 1,
    DUPLICATED_EMAIL: 2,
    INVALID_MAIL_ADDR: 3,
    EMAIL_ERR: 4
}

const REGISTER = [
    {
        status: 200
    }, 
    {
        status: 400,
        body: { err_code: REGISTER_STATUS['DUPLICATED_USER'], err_msg: "duplicated user" }
    },
    {
        status: 400, 
        body: { err_code: REGISTER_STATUS['DUPLICATED_EMAIL'], err_msg: "duplicated email" }
    },
    {
        status: 400,
        body: { err_code: REGISTER_STATUS['INVALID_MAIL_ADDR'], err_msg: "invalid email address" }
    },
    {
        status: 500,
        body: { err_code: REGISTER_STATUS['EMAIL_ERR'], err_msg: "email sent failed" }
    },    
];

const TOKEN_STATUS = {
    SUCCEED : 0,
    USER_NOT_FOUND: 1,
    VERIFIED : 2,
    EMAIL_ERR: 3
}

const TOKEN = [
    {
        status: 200
    }, 
    {
        status: 400,
        body: { err_code: TOKEN_STATUS['USER_NOT_FOUND'], err_msg: "user not found" }
    },
    {
        status: 400,
        body: { err_code: TOKEN_STATUS['VERIFIED'], err_msg: "Email has confirmed" }
    },
    {
        status: 400,
        body: { err_code: TOKEN_STATUS['EMAIL_ERR'], err_msg: "Email send error occured" }
    },
];

const GET_PUBLIC_INFO_STATUS = {
    SUCCEED : 0,
    USER_NOT_FOUND: 1,
}

const GET_PUBLIC_INFO = [
    {
        status : 200
    },
    {
        status: 400, // bad request
        body: {
            err_code: GET_PUBLIC_INFO_STATUS['USER_NOT_FOUND'],
            err_msg: "there is no user with such id"
        }
    }
];
module.exports = {
    LOGIN_STATUS,
    LOGIN,
    REGISTER_STATUS,
    REGISTER,
    TOKEN_STATUS,
    TOKEN,
    GET_PUBLIC_INFO_STATUS,
    GET_PUBLIC_INFO
}