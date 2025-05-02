import axios from "axios";

export const URL = "http://localhost:5000";

export async function getEvents() {
    const response = await axios.get(`${URL}/events`);

    if (response.status === 200) {
        return response;
    } else {
        return;
    }
}

export async function getApprovedEvents() {
    const response = await axios.get(`${URL}/home`);

    if (response.status === 200) {
        return response;
    } else {
        return;
    }
}

export async function getEvent(id) {
    const response = await axios.get(`${URL}/events/${id}`);

    if (response.status === 200) {
        return response.data;
    } else {
        return;
    }
}

export async function createEvent(eventData) {

    const response = await axios.post(`${URL}/events`, eventData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response;
}

export async function updateEvent(id, event ) {
    const response = await axios.put(`${URL}/events/${id}`, event);
     
    return response;
}

export async function deleteEvent(id ) {
    const response = await axios.delete(`${URL}/events/${id}`);
      
    return response;
}

export async function getUsers() {
    const response = await axios.get(`${URL}/users`);

     if (response.status === 200) {
        return response.data;
    }else {
        return;
    }
}

export async function getShopOwners() {
    const response = await axios.get(`${URL}/shopOwners`);

     if (response.status === 200) {
        return response.data;
    }else {
        return;
    }
}

export async function createUser(user ) {
    const response = await axios.post(`${URL}/users`, user);
     
    return response;
}

export async function updateUser(id, user ) {
    const response = await axios.put(`${URL}/users/${id}`, user);
     
    return response;
}

export async function deleteUser(id ) {
    const response = await axios.delete(`${URL}/users/${id}`);
     
    return response;
}

export async function searchUsers(query ) {
    const response = await axios.get(`${URL}/users/${query}`);

     if (response.status === 200) {
        return response.data;
    }else {
        return;
    }
}

export async function userLogin(user) {
    const response = await axios.post(`${URL}/users/login`, user);

    if (response.status === 200) {
        return response.data;
    } else {
        return;
    }
}

export async function getUserTypes() {
    const response = await axios.get(`${URL}/userType`);

     if (response.status === 200) {
        return response.data;
    } else {
        return;
    }
}

export async function createUserType(UserType ) {
    const response = await axios.post(`${URL}/userType`, UserType);
    return response;
}

export async function updateUserType(id, UserType ) {
    const response = await axios.put(`${URL}/userType/${id}`, UserType);
    return response;
}

export async function deleteUserType(id ) {
    const response = await axios.delete(`${URL}/userType/${id}`);
    return response;
}

export async function getClubs() {
    const response = await axios.get(`${URL}/clubs`);

    if (response.status === 200) {
        return response.data;
    }else {
        return;
    }
}

export async function createClub(club ) {
    const response = await axios.post(`${URL}/clubs`, club);
    return response;
}

export async function updateClub(id, club ) {
    const response = await axios.put(`${URL}/clubs/${id}`, club);
    return response;
}

export async function deleteClub(id ) {
    const response = await axios.delete(`${URL}/clubs/${id}`);
    return response;
}






export async function getItems() {

    var token = localStorage.getItem("token");

    const headers = {
        'Content-Type': 'application/json',
      };
  
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.get(`${URL}/api/products/items`, { headers });

    if (response.status === 200) {
        return response.data;
    } else {
        return;
    }
}

export async function getSellerItems() {

    var token = localStorage.getItem("token");

    const headers = {
        'Content-Type': 'application/json',
      };
  
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await axios.get(`${URL}/api/products/sellerItems`, { headers });

    if (response.status === 200) {
        return response.data;
    } else {
        return;
    }
}

export async function createItem(item, imageFile) {
    const formData = new FormData();
    formData.append('name', item.name);
    formData.append('image', imageFile);
    formData.append('qty', item.qty);
    formData.append('price', item.price);

    var token = localStorage.getItem("token");

    const headers = {
        'Content-Type': 'multipart/form-data',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await axios.post(`${URL}/api/products/createItem`, formData, { headers });

    return response;
}

export async function updateItem(id, item) {
    const formData = new FormData();
    formData.append('name', item.name);
    if (item.imageFile) {
        formData.append('image', item.imageFile);
    }
    formData.append('qty', item.qty);
    formData.append('price', item.price);

    const token = localStorage.getItem("token");

    const headers = {};
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await axios.put(`${URL}/api/products/updateItem/${id}`, formData, { headers });


    return response;
}

export async function deleteItem(id ) {

    var token = localStorage.getItem("token");

    const headers = {
        'Content-Type': 'application/json',
      };
  
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      try {
        const response = await axios.delete(`${URL}/api/products/deleteItem/${id}`, { headers });

        return response;
    
    } catch (error) {
        if (error.response) {
            if (error.response.status === 400 || error.response.status === 404) {
                alert(error.response.data.message);
                return new error;
            } else {
                alert('An unexpected error occurred.');
                return new error;
            }
        } else {
            alert('Network error or server did not respond.');
            return new error;
        }
    }    

}

export async function searchSellerItems(query) {
    
    if(query.length === 0){
        query = "1";
      }

    var token = localStorage.getItem("token");

    const headers = {
        'Content-Type': 'application/json',
      };
  
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

    const response = await axios.get(`${URL}/api/products/sellerSearch/${query}`,{headers});

    if (response.status === 200) {
        return response.data;
    } else {
        return;
    }
}

export async function searchItems(query ) {
    const response = await axios.get(`${URL}/api/products/search/${query}`);

    if (response.status === 200) {
        return response.data;
    } else {
        return;
    }
}

export async function getEventProducts(id) {
    const response = await axios.get(`${URL}/api/eventProducts/getEventProducts/${id}`);

    if (response.status === 200) {
        return response;
    } else {
        return;
    }
}


export async function getSellerEventProducts() {

    var token = localStorage.getItem("token");

    const headers = {
        'Content-Type': 'application/json',
      };
  
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

    const response = await axios.get(`${URL}/api/eventProducts/getSellerEventProducts`,{headers});

    if (response.status === 200) {
        return response;
    } else {
        return;
    }
}

export async function addEventProduct(eventId,resources) {

    var formData = new FormData();
    formData.append('eventId',eventId);
    formData.append('resources',resources);

    var token = localStorage.getItem("token");

    const headers = {
        'Content-Type': 'application/json',
      };
  
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

    const response = await axios.post(`${URL}/api/eventProducts/createEventProduct`, formData , {headers});

    return response;
}

export async function updateEventProduct(id,status) {

    const response = await axios.put(`${URL}/api/eventProducts/updateEventProduct/${id}/${status}`);

    return response;
}

export async function getOrders(){
    const response = await axios.get(`${URL}/orders`);

    if(response.status === 200){
        return response.data;
    }else{
        return;
    }
}

export async function approve(id){
    const response = await axios.put(`${URL}/approve/${id}`);

    if(response.status === 200){
        return response;
    }else{
        return;
    }
}