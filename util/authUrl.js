
exports.generateAuthUrl = (promptType) => { 
    const url = process.env.AUTH_URI
    const options = {
        client_id : process.env.CLIENT_ID,
        redirect_uri : process.env.REDIRECT_URI,
        response_type : 'code',
        prompt : promptType,
        scope : [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email"
        ].join(' ')
    }
    return `${url}?${qs.stringify(options)}`
}


