class User {
    constructor(
        firstName,
        lastName,
        role,
        email,
        password,
        gdpr,
        createdAt,
        isActive
    ) {
        this.firstName = firstName
        this.lastName = lastName
        this.role = role
        this.email = email
        this.password = password
        this.gdpr = gdpr
        this.createdAt = createdAt
        this.isActive = isActive
    }
}
module.exports = {User }
