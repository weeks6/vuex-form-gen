// @ts-nocheck because I cant bother with the ts issue
import { createStore } from "vuex";

export interface FormsState {
  [formName: string]: Record<string, any>;
}

export const store = createStore<{ forms: FormsState }>({
  state: {
    forms: {
      basic: {},
      "custom-slots": {},
      "submit-handler": {},
    },
  },
  mutations: {
    SET_FORM(state, payload: { formName: string; data: Record<string, any> }) {
      state.forms[payload.formName] = { ...payload.data };
    },
    RESET_FORM(state, payload: { formName: string }) {
      state.forms[payload.formName] = {};
    },
  },
  actions: {
    updateForm(
      { commit },
      { formName, data }: { formName: string; data: Record<string, any> },
    ) {
      commit("SET_FORM", { formName, data });
    },
    resetForm({ commit }, formName: string) {
      commit("RESET_FORM", { formName });
    },
  },
  getters: {
    getForm: (state) => (formName: string) => state.forms[formName] || {},
  },
});
