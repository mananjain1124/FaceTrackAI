import api from "./api";

export async function recognizeEmployee(image: string) {
  const response = await api.post(
    "/api/recognition/recognize",
    {
      image,
    }
  );

  return response.data;
}