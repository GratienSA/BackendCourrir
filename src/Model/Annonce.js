class Annonce {
    constructor(
        title,
        description,
        image,
        category,
        userId,
        createdAt,
        status
    ) {
        this.title = title
        this.description = description
        this.image = image
        this.category = category
        this.userId = userId
        this.createdAt = createdAt
        this.status = status
    }
}
module.exports = { Annonce }
