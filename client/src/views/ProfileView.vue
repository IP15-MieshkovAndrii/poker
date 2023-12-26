<template>
    <div>
        <h1>Welcome to the SuperPoker!</h1>
        <p v-if="displayName">Hello, {{ displayName }}!</p>
    </div>
</template>

<script>
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default {
    name: 'ProfileView',
    data() {
        return {
            displayName: '',
        };
    },
    methods: {

        getCurrentUser() {
            return new Promise((resolve, reject) => {
                const removeListener = onAuthStateChanged(
                getAuth(),
                (user) => {
                    removeListener();
                    resolve(user);
                },
                reject
                );
            })
        },

        async fetchDisplayName() {
            let user = await this.getCurrentUser();
            if (user) {
                this.displayName = user.displayName;
            }


        },
    },
    created() {

        this.fetchDisplayName();
    },
};
</script>

<style scoped>

</style>
