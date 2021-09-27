/** @jsxImportSource @emotion/react */
import React, { useEffect, useState } from 'react';
import { wrapper } from './styles.js';

function App() {
  const baseUrl = 'https://guest-list-fxl.herokuapp.com';

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [allGuests, setAllGuests] = useState([]);

  // Function to get the List of al Guests

  useEffect(() => {
    async function AllGuests() {
      const response = await fetch(`${baseUrl}/`);
      const guests = await response.json();
      setAllGuests(guests);
    }
    AllGuests();
  }, []);
  // The [] are there to add a dependecy like a toggle to the useEffect, in which case the useEffect triggers its function every time the dependency is triggered.

  // Function to add a New Guest
  async function addGuest() {
    const response = await fetch(`${baseUrl}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: ` ${firstName} `,
        lastName: ` ${lastName} `,
      }),
    });
    const createdGuest = await response.json();

    // Push the new guest to the array of existing Guests. First we have to copy the current list, then add a new entry, the set the overall LIst to the updated one.

    const currentList = [...allGuests];
    currentList.push(createdGuest);
    setAllGuests(currentList);
  }

  // Function to remove a Guest from the List. The function fetches the guest ID from the objects in the api.

  async function deleteGuest(guest) {
    const response = await fetch(`${baseUrl}/${guest.id}`, {
      method: 'DELETE',
    });
    const deletedGuest = await response.json();
    // Filter the removed Guest from the Array, in Detail: declaring a new Variable in which the deleted guest is filtered out by id, so the .filter creates a new array in which all IDs exept the deleted one are included.
    const updateGuestList = allGuests.filter((g) => g.id !== deletedGuest.id);
    setAllGuests(updateGuestList);
  }
  async function updateAttendance(guest) {
    await fetch(`${baseUrl}/${guest.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ attending: true }),
    });
  }

  function handleAttending(id, attending) {
    // Similar principle to the delete-function commented below. First we have to have a copy of the full guest list array, the key from the list provides us with the ID since the checkbox is generated for each guest by the map function, then we find the guest-object in which we want to change the attending to true, then we have to call the update function with the findGuest variable as attribute. After that, we have to update the complete list again.
    const copyAllGuests = [...allGuests];
    const findGuest = copyAllGuests.find((g) => g.id === id);
    findGuest.attending = attending;
    updateAttendance(findGuest);
    setAllGuests(copyAllGuests);
  }

  return (
    <div className="Wrapper" css={wrapper}>
      <div className="App">
        <h1 className="Header">Guest List</h1>
        <h2 className="AllCurrentGuests">All Current Guests</h2>
        {/* Reminder, this took you forever to figure out. In order to delete a guest via a button, have the .map also render a button for each Guest, and because we assign each <li> the id of the guest as the key, the delete-function can access the ID without passing it with some other extra step.  */}
        <ul>
          {allGuests.map((guest) => (
            <li key={guest.id}>
              {guest.firstName}
              {guest.lastName}
              <input
                type="checkbox"
                checked={guest.attending}
                onChange={(event) =>
                  handleAttending(guest.id, event.currentTarget.checked)
                }
              />
              <button onClick={() => {}}>Edit</button>

              <button
                onClick={() => {
                  deleteGuest(guest);
                }}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>

        <h2>Add a Guest</h2>
        <input
          value={firstName}
          placeholder="First Name"
          onChange={(e) => {
            setFirstName(e.currentTarget.value);
          }}
        />
        <input
          value={lastName}
          placeholder="Last Name"
          onChange={(e) => {
            setLastName(e.currentTarget.value);
          }}
        />

        <br />
        <button
          className="AddGuestButton"
          onClick={() => {
            addGuest();
            setFirstName('');
            setLastName('');
          }}
        >
          Add new Guest
        </button>
        <br />
        <br />
      </div>
    </div>
  );
}
export default App;
