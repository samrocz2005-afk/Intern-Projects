import api from "./api";

/*
|--------------------------------------------------------------------------
| Get Flavors
|--------------------------------------------------------------------------
| GET /api/flavors
|--------------------------------------------------------------------------
*/

export const getFlavors = async (params = {}) => {
  const response = await api.get("/flavors", {
    params,
  });

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Get Flavor
|--------------------------------------------------------------------------
| GET /api/flavors/:id
|--------------------------------------------------------------------------
*/

export const getFlavor = async (id) => {
  if (!id) {
    throw new Error("Flavor ID is required");
  }

  const response = await api.get(
    `/flavors/${id}`
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Create Flavor
|--------------------------------------------------------------------------
| POST /api/flavors
| Admin only
|--------------------------------------------------------------------------
*/

export const createFlavor = async (data) => {
  const response = await api.post(
    "/flavors",
    {
      name: data.name,
      description: data.description || "",
      vcpus: Number(data.vcpus),
      ram: Number(data.ram),
      disk: Number(data.disk),
      hourlyPrice: Number(data.hourlyPrice),
      monthlyPrice:
        data.monthlyPrice === "" ||
        data.monthlyPrice === null ||
        data.monthlyPrice === undefined
          ? null
          : Number(data.monthlyPrice),
      isActive:
        data.isActive !== undefined
          ? Boolean(data.isActive)
          : true,
    }
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Update Flavor
|--------------------------------------------------------------------------
| PUT /api/flavors/:id
| Admin only
|--------------------------------------------------------------------------
*/

export const updateFlavor = async (
  id,
  data
) => {
  if (!id) {
    throw new Error("Flavor ID is required");
  }

  const payload = {};

  if (data.name !== undefined) {
    payload.name = data.name;
  }

  if (data.description !== undefined) {
    payload.description = data.description;
  }

  if (data.vcpus !== undefined) {
    payload.vcpus = Number(data.vcpus);
  }

  if (data.ram !== undefined) {
    payload.ram = Number(data.ram);
  }

  if (data.disk !== undefined) {
    payload.disk = Number(data.disk);
  }

  if (data.hourlyPrice !== undefined) {
    payload.hourlyPrice = Number(
      data.hourlyPrice
    );
  }

  if (data.monthlyPrice !== undefined) {
    payload.monthlyPrice =
      data.monthlyPrice === "" ||
      data.monthlyPrice === null
        ? null
        : Number(data.monthlyPrice);
  }

  if (data.isActive !== undefined) {
    payload.isActive = Boolean(
      data.isActive
    );
  }

  const response = await api.put(
    `/flavors/${id}`,
    payload
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Update Flavor Status
|--------------------------------------------------------------------------
| PATCH /api/flavors/:id/status
| Admin only
|--------------------------------------------------------------------------
*/

export const updateFlavorStatus = async (
  id,
  isActive
) => {
  if (!id) {
    throw new Error("Flavor ID is required");
  }

  const response = await api.patch(
    `/flavors/${id}/status`,
    {
      isActive: Boolean(isActive),
    }
  );

  return response.data;
};

/*
|--------------------------------------------------------------------------
| Delete Flavor
|--------------------------------------------------------------------------
| DELETE /api/flavors/:id
| Admin only
|--------------------------------------------------------------------------
*/

export const deleteFlavor = async (id) => {
  if (!id) {
    throw new Error("Flavor ID is required");
  }

  const response = await api.delete(
    `/flavors/${id}`
  );

  return response.data;
};