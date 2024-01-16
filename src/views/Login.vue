<script setup>
import { supabase } from '../lib/supabaseClient.js'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import store from '@/store'

// Data
const email = ref('')
const password = ref('')
const errorMsg = ref(null)
const emailErrMsg = ref(null)
const router = useRouter()

// Email check
const emailErr = () => {
    let at = 0
    if (email.value == null || email.value == '') {
        return
    }
    for (let i=0; i<=email.value.length; i++) {
        if (email.value[i] == '@') {
            at += 1
        }
    }
    if (at !== 1) {
        emailErrMsg.value = 'Enter valid Email ID'
        setTimeout(() => {
            emailErrMsg.value = null
        }, 3000)
    }
}

//Login Function
const login = async () => {
    try {
        const {data, error} = await supabase.auth.signInWithPassword({
            email: email.value,
            password: password.value
        })
        
        if (error) throw error
        router.push({name:'home'})
    } catch (error) {
        errorMsg.value = error.message
        setTimeout(() => {
            errorMsg.value = null
        }, 3000);
    }
    try {
        const { data: { user }} = await supabase.auth.getUser()
        store.userData.userId = user.id
    } catch (error) {
        console.log(error.message)
    }
}



</script>

<template>
    <div class="container-sm mt-5">
        <div class="d-flex flex-column justify-content-center align-items-center">
            <div class="mt-5 px-5 py-5">
                <h3 class="h3">Login</h3>
            </div>
            <div class="mt-1 w-25">
                <label for="email" class="form-label">Email</label>
                <input v-model="email" @focusout="emailErr" type="email" class="form-control" id="email" />
                <p v-if="emailErrMsg" class="position-absolute text-danger">{{ emailErrMsg }}</p>
            </div>
            <div class="mt-4 w-25">
                <label for="password" class="form-label">Password <span class="forgot-password position-relative start-50"><router-link class="forgot-password" :to="{name:''}">Forgot Password?</router-link></span></label>
                
                <input v-model="password" type="password" class="form-control" id="password" />
            </div>
            
            <button @click="login" type="submit" class="mt-4 btn btn-primary">Login</button>
            <div class="mt-2">
                <p>Don't have an account?<router-link class="register-link" :to="{ name: 'register' }"><span class="register-link"> Register</span></router-link></p>
            </div>
        </div>
        <div v-if="errorMsg">
            <p class="text-danger text-center">{{ errorMsg }}</p>
        </div>
    </div>
</template>

<style scoped>
.h3 {
    font-weight: 600;
    color: rgb(16, 105, 194);
}

label {
    font-weight: 500;
}

button {
    width: 200px;
}

.forgot-password {
    font-weight: 600;
    font-size: 13px;
    color: rgb(4, 109, 189);
    text-decoration: none;
}

.forgot-password:hover {
    color: rgb(2, 137, 241);
}

.register-link {
    text-decoration: none;
    font-weight: 500;
    color:rgb(20, 98, 161)
}

.register-link:hover {
    color:rgb(57, 156, 237)
}

</style>