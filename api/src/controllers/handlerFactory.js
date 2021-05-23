const { AccessControl } = require("accesscontrol");

const { catchAsync } = require("../middleware/errors");
const APIFeatures = require("../utils/apiFeatures");
const createResponse = require("../utils/createResponse");
const { validate } = require("../validation/joi");

// ----------------------------------------------------------------------------

exports.validate = (schema) =>
  catchAsync(async (req, res, next) => {
    await validate(schema, req.body);
    next();
  });

// ----------------------------------------------------------------------------

exports.createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (req.accessAttributes)
      req.body = AccessControl.filter(req.body, req.accessAttributes);

    if (req.restrictToOwner) req.body.owner = req.session.userId;

    const doc = await Model.create(req.body);

    return res.status(201).json(createResponse(true, { data: { doc } }));
  });

// ----------------------------------------------------------------------------

exports.getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const queryConfig = {
      restrictToOwner: req.restrictToOwner,
      userId: req.session.userId || undefined,
    };

    const features = APIFeatures.full(Model.getQuery(queryConfig), req.query);

    const [totalResults, docs] = await Promise.all([
      APIFeatures.count(Model.getQuery(queryConfig), req.query),
      features.query,
    ]);

    const pageCount =
      Math.trunc(totalResults / features.limit) +
      !!(totalResults % features.limit);

    return res.status(200).json(
      createResponse(true, {
        results: docs.length,
        totalResults,
        page: features.page,
        pageCount,
        data: { docs },
      })
    );
  });

// ----------------------------------------------------------------------------

exports.getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.getDocument(req.params.id, {
      restrictToOwner: req.restrictToOwner,
      userId: req.session.userId || undefined,
    });

    return res.status(200).json(createResponse(true, { data: { doc } }));
  });

// ----------------------------------------------------------------------------

exports.updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (req.accessAttributes)
      req.body = AccessControl.filter(req.body, req.accessAttributes);

    const doc = await Model.getDocument(req.params.id, {
      restrictToOwner: req.restrictToOwner,
      userId: req.session.userId || undefined,
    });

    for (const [key, value] of Object.entries(req.body)) {
      doc[key] = value;
    }

    await doc.save();

    return res.status(202).json(createResponse(true, { data: { doc } }));
  });

// ----------------------------------------------------------------------------

exports.deleteOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.getDocument(req.params.id, {
      restrictToOwner: req.restrictToOwner,
      userId: req.session.userId || undefined,
    });

    doc.deleteOne();

    return res.status(204).json(createResponse(true, { data: null }));
  });
