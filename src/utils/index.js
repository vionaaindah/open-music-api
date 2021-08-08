const mapDBToModel  = ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    create_time,
    update_time,
}) => ({
    id,
    title,
    year,
    performer,
    genre,
    duration,
    insertedAt: create_time,
    updatedAt: update_time,
});
  
module.exports = { mapDBToModel  };
  