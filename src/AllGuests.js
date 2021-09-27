export default async function AllGuests() {
  const baseUrl = 'http://localhost:5000';

  const response = await fetch(`${baseUrl}/`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const allGuests = await response.json();
  return allGuests;
}
AllGuests();
