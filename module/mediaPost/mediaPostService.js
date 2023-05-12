const mediaPostSchema = require("../../model/media_post");

const addMediaPost = async (req) => {
    const result = { data: null };
    const { title, description, type, media, file_name, slug, meta, likes, createdBy, status } = req.body;
    const mediaPost = await mediaPostSchema.create({
        title: title,
        description: description,
        type: type,
        media: media,
        file_name: file_name,
        slug: slug,
        meta: meta,
        // likes:likes,
        // createdBy:createdBy,
        status: status
    });
    if (mediaPost) {
        result.data = mediaPost;
        result.code = 201;
    } else {
        result.code = 204;
    }
    return result;
}

const updateMediaPost = async (req) => {
    const result = { data: null };
    const { id, title, description, type, media, file_name, slug, meta, likes, createdBy, status } = req.body;
    const filter = { _id: id };
    const mediaPost = await mediaPostSchema.updateOne(filter, {
        title: title,
        description: description,
        type: type,
        media: media,
        file_name: file_name,
        slug: slug,
        meta: meta,
        // likes:likes,
        // createdBy:createdBy,
        status: status
    });
    if (mediaPost) {
        result.data = mediaPost;
        result.code = 202;
    } else {
        result.code = 204;
    }
    return result;
}

const getAllMediaPost = async (req) => {
    const result = { data: null };
    const mediaPost = await mediaPostSchema.find();
    if (mediaPost) {
        result.data = mediaPost;
        result.code = 200;
    } else {
        result.code = 204;
    }
    return result;
}

const getMediaPost = async (req) => {
    const result = { data: null };
    const id = req.params.id;
    const mediaPost = await mediaPostSchema.findOne({ _id: id });
    if (mediaPost) {
        result.data = mediaPost;
        result.code = 200;
    } else {
        result.code = 204;
    }
    return result;
}

const deleteMediaPost = async (req) => {
    const result = { data: null };
    const id = req.params.id;
    const mediaPost = await mediaPostSchema.deleteOne({ _id: id });
    if (mediaPost) {
        result.data = mediaPost;
        result.code = 200;
    } else {
        result.code = 204;
    }
    return result;
}

module.exports = {
    addMediaPost,
    updateMediaPost,
    getAllMediaPost,
    getMediaPost,
    deleteMediaPost
}