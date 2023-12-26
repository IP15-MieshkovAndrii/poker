<template>
    <div class="header">
        <router-link to="/">
            <div class="logo"><h1>SuperPoker</h1></div>
        </router-link>
        <div class="menu">
            <router-link v-if="!isLoggedIn" to="/sign-in">Sign In</router-link>
            <button @click="handleSignOut" v-if="isLoggedIn">Sign Out</button>
            <div @click="profile" class="avatar">
                <svg viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg">
                    <path fill="#000000" d="M628.736 528.896A416 416 0 0 1 928 928H96a415.872 415.872 0 0 1 299.264-399.104L512 704l116.736-175.104zM720 304a208 208 0 1 1-416 0 208 208 0 0 1 416 0z"/>
                </svg>
            </div>
        </div>
        

    </div>
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    import { getAuth, onAuthStateChanged, signOut} from "firebase/auth"
    import router from '@/router/router';
    
    const isLoggedIn = ref(false);

    let auth;
    onMounted(() => {
        auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                isLoggedIn.value = true;
            } else {
                isLoggedIn.value = false;
            }
        })
    })


    const handleSignOut = () => {
        signOut(auth).then(() => {
            router.push("/")
        })
    };

    const profile = () => {
        auth = getAuth();
        onAuthStateChanged(auth, (user) => {
            if (user) {
                router.push('/profile')
            } else {
                router.push('/sign-in')
            }
        })

    };
</script>


<style scoped>
.header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0.1em 3em;
    border-bottom: 3px solid black;
}

.logo h1 {
    color: black;
    font-weight: 800;
    font-family: Verdana, Geneva, Tahoma, sans-serif;
    padding: 0;
    font-size: 2.5vw;
    cursor: pointer;
}

button {
    cursor: pointer;
    padding: 0.5em 1em;
    border: 2px solid black;
    border-radius: 5px;
    background-color: white;
    color: black;
    font-weight: bold;
    transition: background-color 0.3s, color 0.3s;
}

button:hover {
    background-color: black;
    color: white;
}

.avatar {
    width: 2vw;
    min-height: 0.1px;
    aspect-ratio: 1/1;
    border: 2px solid black;
    border-radius: 60%;
    padding: 0.5em;
    cursor: pointer;
}

.menu {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 1em;
}

</style>