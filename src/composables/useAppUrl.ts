import { ref } from "vue";

interface ITrustedHosts {
  host: string;
  api: string;
}

const trustedHosts: ITrustedHosts[] = [
  // test
  {
    host: "http://195.158.28.22:8081",
    api: "http://195.158.28.22:17586/"
  },
  // bek local
  {
    host: "http://172.26.26.178:8088",
    api: "http://195.158.28.22:17586/"
  },

  // production
  {
    host: "https://imp.ihma.uz",
    api: "https://imp.ihma.uz/api/"
  }
];

export const useAppUrl = () => {
  const API_URL = ref<string>("http://195.158.28.22:17586/");
  // const API_URL = ref<string>("https:imp.ihma.uz/api");

  trustedHosts.forEach((el) => {
    if (window.location.href.indexOf(el.host) > -1) {
      API_URL.value = `${el.api}`;
    }
  });

  return {
    API_URL
  };
};
