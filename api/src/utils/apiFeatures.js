class APIFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryObject = queryString;
  }

  static full(query, queryString) {
    const features = new APIFeatures(query, queryString);
    return features.filter().sort().limitFields().paginate();
  }

  static async count(query, queryString) {
    const features = new APIFeatures(query, queryString);
    return await features.filter().sort().limitFields().query.countDocuments();
  }

  filter() {
    const queryObj = { ...this.queryObject };
    const excludedFields = ["page", "sort", "limit", "fields"];
    excludedFields.forEach((el) => delete queryObj[el]);
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)/g, (match) => `\$${match}`);
    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  sort() {
    if (this.queryObject.sort) {
      const sortBy = this.queryObject.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  limitFields() {
    if (this.queryObject.fields) {
      const fields = this.queryObject.fields.split(",").join(" ");
      this.query = this.query.select(fields);
    }
    return this;
  }

  paginate() {
    const page = this.queryObject.page * 1 || 1;
    let limit = this.queryObject.limit * 1 || 100;
    if (limit > 500) limit = 500;

    this.page = page;
    this.limit = limit;

    const skip = (page - 1) * limit;
    this.query = this.query.limit(limit).skip(skip);
    return this;
  }
}

module.exports = APIFeatures;
