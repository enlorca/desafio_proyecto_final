const { models } = require("../config/sequelize");
const boom = require("@hapi/boom");

class RatingService {
  constructor() {}

  async create(rating) {
    let data = {
      ...rating,
      deleted: rating.deleted ?? false,
      updated_at: new Date(),
    };
    const ratingExists = await models.Rating.findOne({
      where: { user_id: data.user_id, book_id: data.book_id },
    });
    if (ratingExists) {
      const rta = await ratingExists.update(data);
      return rta;
    }
    data = { ...data, created_at: new Date() };
    const newRating = await models.Rating.create(data);
    return newRating;
  }

  async findAll() {
    const ratings = await models.Rating.findAll();
    return ratings;
  }

  async findOne(id) {
    const rating = await models.Rating.findByPk(id);
    if (!rating) {
      throw boom.notFound("Rating not found");
    }
    return rating;
  }

  async update(changes, id) {
    const rating = await this.findOne(id);
    const rta = await rating.update(changes);
    return rta;
  }

  async delete(id) {
    const rating = await this.findOne(id);
    const rta = await rating.update({ deleted: true });
    return rta;
  }

  async activate(id) {
    const rating = await models.Rating.findByPk(id);
    if (!rating) {
      throw boom.notFound("Rating not found");
    }
    const rta = await rating.update({ deleted: false });
    return rta;
  }

  async getCommentsByBook(book_id) {
    const comments = await models.Rating.findAll({
      where: { book_id, deleted: false },
    });
    if (!comments) {
      return null;
    }
    return comments;
  }

  async getWishlist(user_id) {
    try {
      const wishlist = await models.Rating.findAll({
        where: { user_id: user_id, wishlist: true, deleted: false },
      });
      return wishlist;
    } catch (error) {
      throw error;
    }
  }

  async getRatingByBook(book_id) {
    let promedio = 0;
    try {
      const rating = await models.Rating.findAll({
        where: { book_id, deleted: false },
      });
      if (rating.length == 0) {
        return 0;
      }
      rating.forEach((rating) => {
        promedio = promedio + rating.score;
      });
      promedio = promedio / rating.length;
      return promedio;
    } catch (error) {
      throw error;
    }
  }

  /* Obtiene el estado de la wishlist del usuario para un libro */
  async getWishlistByBook_User(book_id, user_id) {
    try {
      const wishlist = await models.Rating.findAll({
        where: { book_id, user_id, wishlist: true, deleted: false },
      });
      if (wishlist.length == 0) {
        return false;
      }
      return wishlist[0].wishlist;
    } catch (error) {
      throw error;
    }
  }

  async getWishlistBooksByUser(user_id) {
    try {
      const wishlistBooks = await models.Rating.findAll({
        where: { user_id, wishlist: true, deleted: false },
      });
      if (wishlistBooks.length == 0) {
        return false;
      }
      return wishlistBooks;
    } catch (error) {
      throw error;
    }
  }

  async updateWishlist(user_id, book_id, wishlist) {
    try {
      let rating = await models.Rating.findAll({
        where: { user_id, book_id, deleted: false },
      });

      if (rating.length === 0) {
        rating = await models.Rating.create({
          user_id,
          book_id,
          score: 5,
          comment: "",
          wishlist,
          created_at: new Date(),
          updated_at: new Date(),
          deleted: false,
        });
      } else {
        await models.Rating.update(
          { wishlist, updated_at: new Date() },
          { where: { user_id, book_id } }
        );
      }

      return rating;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = RatingService;
