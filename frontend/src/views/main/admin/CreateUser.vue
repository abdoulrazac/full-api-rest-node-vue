<template>
  <v-container fluid>
    <v-card class="ma-2 pa-2">
      <v-card-title primary-title>
        <div class="headline primary--text">Nouveau utilisateur</div>
      </v-card-title>
      <v-card-text>
        <template>
          <v-form v-model="valid" ref="form" lazy-validation>
            <v-layout row wrap justify-space-around>
              <v-flex xs10 md5>
                <v-text-field
                  label="Nom et prénon"
                  v-model="full_name"
                  data-vv-name="nom" 
                  data-vv-delay="100" 
                  v-validate="{required: true}"
                  :error-messages="errors.first('nom')"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs10 md5>
                <v-text-field
                  label="E-mail"
                  type="email"
                  v-model="email"
                  v-validate="'required|email'"
                  data-vv-name="email"
                  :rules="[checkEmail]"
                  :error-messages="errors.collect('email')"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs10 md5>
                <v-text-field
                  label="Téléphone"
                  type="tel"
                  v-model="telephone"
                  data-vv-name="telephone" 
                  data-vv-delay="100" 
                  v-validate="{required: true}"
                  :error-messages="errors.first('telephone')"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs5 md2>
                <v-text-field
                  label="CNIB/Passport"
                  v-model="cnib_passport"
                  data-vv-name="CNIB" 
                  data-vv-delay="100" 
                  v-validate="{required: true}"
                  :error-messages="errors.first('CNIB')"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs5 md2>
                <v-text-field
                  label="Lieu CNIB/Passport"
                  v-model="lieu_cnib"
                  data-vv-name="lieu-CNIB" 
                  data-vv-delay="100" 
                  v-validate="{required: true}"
                  :error-messages="errors.first('lieu-CNIB')"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs10 md5>
                <v-text-field
                  label="Type de permis de conduire"
                  v-model="permis_type"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs10 md5>
                <v-text-field
                  label="Date du permis de conduire"
                  v-model="permis_date"
                  type="date"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs10 md5>
                <v-text-field
                  label="Date début du contrat"
                  v-model="contrat_debut"
                  type="date"
                  required
                ></v-text-field>
              </v-flex>
              <v-flex xs10 md5>
                <v-text-field
                  label="Date fin du contrat"
                  v-model="contrat_fin"
                  type="date"
                  required
                ></v-text-field>
              </v-flex>
            </v-layout>
              <v-spacer></v-spacer>

            <v-layout row wrap justify-space-around>
              <v-flex xs10 md5>
                <div class="subheading secondary--text text--lighten-2">Utilisateur actif<span v-if="isActive"> ( Actuellement actif)</span><span v-else>(Actuellement non actif )</span></div>
                <v-checkbox
                  label="Est Actif"
                  v-model="isActive"
                ></v-checkbox>
              </v-flex>
              <v-flex xs10 md5>
                <div class="subheading secondary--text text--lighten-2">Administrateur <span v-if="isAdmin">(Actuellement admin)</span><span v-else>(Actuellement non admin)</span></div>
                <v-checkbox
                  label="Est Administrateur"
                  v-model="isAdmin"
                ></v-checkbox>
              </v-flex>
            </v-layout>
            <v-layout row wrap justify-space-around>
              <v-flex xs10 md10>
                <v-textarea
                  label="Plus de description"
                  v-model="description"
                  auto-grow
                  outlined
                  rows="3"
                  row-height="25"
                ></v-textarea>
              </v-flex>
            </v-layout>

            <v-layout justify-space-around row wrap>
              <v-flex xs10 md4>
                <v-text-field 
                  label="Mot de passe" 
                  type="password"
                  ref="password"
                  data-vv-name="password" 
                  data-vv-delay="100" 
                  v-validate="{required: true}" 
                  v-model="password1"
                  :error-messages="errors.first('password')">              
                </v-text-field>
              </v-flex>
              <v-flex xs10 md4>
                <v-text-field 
                  type="password" 
                  label="Confirmer mot de passe" 
                  data-vv-name="password_confirmation" 
                  data-vv-delay="100" 
                  data-vv-as="password" 
                  v-validate="{required: true, confirmed: 'password'}" 
                  v-model="password2" 
                  :error-messages="errors.first('password_confirmation')">
                </v-text-field>
              </v-flex>
            </v-layout>
          </v-form>
        </template>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn @click="cancel" elevation="5" >Annuler</v-btn>
        <v-btn @click="reset" color="success" dark>Initialiser</v-btn>
        <v-btn @click="submit" :disabled="!valid" color="primary">Enregister</v-btn>
      </v-card-actions>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch} from 'vue-property-decorator';
import {
  IUserProfile,
  IUserProfileUpdate,
  IUserProfileCreate,
} from '@/interfaces/UserInterface';
import { dispatchGetUsers, dispatchCreateUser } from '@/store/admin/actions';
// import { readAdminUserByEmail } from '@/store/admin/getters';

@Component
export default class CreateUser extends Vue {
vValidate(vValidate: any) {
throw new Error('Method not implemented.');
}
  public valid = false;
  public validEmail = true ;

  public full_name: string = '' ;
  public email: string = '';
  public cnib_passport : string = '' ;
  public lieu_cnib : string = '' ;
  public date_naissance : string = '' ;
  public telephone : string = '' ;
  public description : string = '' ;
  public permis_type : string = '' ;
  public permis_date : string = '' ;
  public contrat_debut : string = '' ;
  public contrat_fin : string = '' ;

  public isActive: boolean = true;
  public isAdmin: boolean = false;
  public setPassword = false;
  public password1: string = '';
  public password2: string = '';
errors: any;

  public async mounted() {
    await dispatchGetUsers(this.$store);
    this.reset();
  }

  public reset() {
    this.full_name = '' ;
    this.email = '';
    this.cnib_passport = '' ;
    this.lieu_cnib = '' ;
    this.date_naissance = '' ;
    this.telephone = '' ;
    this.description = '' ;
    this.permis_type = '' ;
    this.permis_date = '' ;
    this.contrat_debut = '' ;
    this.contrat_fin = '' ;

    this.password1 = '';
    this.password2 = '';
    this.isActive = true;
    this.isAdmin = false;
    this.$validator.reset();
  }

  public checkEmail(){     
    // const userByEmail = readAdminUserByEmail(this.$store)(this.email);  
    let userByEmail = false ;  
    return (!userByEmail ? true:false) || 'Mail existe !'
  }

  public cancel() {
    this.$router.back();
  }

  public async submit() {

    if (await this.$validator.validateAll()) {
      const updatedProfile: IUserProfileCreate = {
        email: this.email,
        full_name: '',
        cnib_passport: '',
        lieu_cnib: '',
        date_naissance: '',
        telephone: '',
        description: '',
        permis_type: '',
        permis_date: '',
        contrat_debut: '',
        contrat_fin: '',
        password: '',
        is_use: false,
        is_active: false,
        is_admin: false,
        is_superuser: false
      };
      if (this.full_name) {
        updatedProfile.full_name = this.full_name;
      }
      if (this.email) {
        updatedProfile.email = this.email;
      }
      if (this.cnib_passport) {
        updatedProfile.cnib_passport = this.cnib_passport ;
      }
      if (this.lieu_cnib) {
        updatedProfile.lieu_cnib = this.lieu_cnib ;
      }
      if (this.telephone) {
        updatedProfile.telephone = this.telephone ;
      }
      if (this.description) {
        updatedProfile.description = this.description ;
      }
      if (this.permis_type) {
        updatedProfile.permis_type = this.permis_type ;
      }
      if (this.permis_date) {
        updatedProfile.permis_date = this.permis_date ;
      }
      if (this.contrat_debut) {
        updatedProfile.contrat_debut = this.contrat_debut ;
      }
      if (this.contrat_fin) {
        updatedProfile.contrat_fin = this.contrat_fin ;
      }
      updatedProfile.is_active = this.isActive;
      updatedProfile.is_admin = this.isAdmin;
      updatedProfile.password = this.password1;
      try {
        await dispatchCreateUser(this.$store, updatedProfile);
      } catch (error) {
        console.log(error);
        
      }
      this.$router.push('/main/admin/users');
    }
  }
}
</script>
