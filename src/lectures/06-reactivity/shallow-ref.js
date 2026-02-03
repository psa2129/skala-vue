import { reactive, shallowReactive } from "vue";

const original = reactive({
  name: "홍길동",
  address: {
    city: "서울",
    zip: "12345",
  },
});

export const userRef = shallowReactive(original);

export function updateName(newName) {
  userRef.name = newName;
}

export function updateCity(newCity) {
  userRef.address.city = newCity;
}
