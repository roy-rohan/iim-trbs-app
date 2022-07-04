import axios from "../../../axios-iim";

export const fetchInformalEventDetail = async (informalEventSlug) => {
  const response = await axios.post(
    "/informal-events/read.php",
    JSON.stringify({
      filters: [
        {
          field_name: "slug",
          value: informalEventSlug,
          op: "=",
        },
      ],
      filter_op: "",
      sort: [],
    })
  );

  return response;
};

export const fetchImages = async (informalEventId) => {
  const response = await axios.post(
    "/images/read.php",
    JSON.stringify({
      filters: [
        {
          field_name: "entity_id",
          value: informalEventId,
          op: "=",
        },
        {
          field_name: "entity_type",
          value: "informal_event",
          op: "=",
        },
      ],
      filter_op: "AND",
      sort: [],
    })
  );

  return response;
};
