import axios from "axios";
import qs from "qs";
import sign from "@/utils/sign";


const instance = axios.create({
  timeout: 60000,
  withCredentials: false,
  baseURL: "",
});

instance.defaults.headers["content-type"] = "application/x-www-form-urlencoded";
instance.interceptors.request.use(
  (config) => {
    sign(config);
    if (config.url != "/api/cat/v1/ability/upload") {
      config.data = qs.stringify(config.data);
    }
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  (res) => {
    if (res.status === 200 && res.data.code == "success") {
      return res.data;
    } else {
      return Promise.reject(res.data);
    }
  },
  (error) => {
    if (error?.message == "Request failed with status code 401") {
      localStorage.removeItem("token");
      location.href = "/login";
    }

    return Promise.reject(error);
  },
);

function request(config = {}) {
  return new Promise((resolve, reject) => {
    instance
      .request(config)
      .then((res: any) => {
        try {
          if (res.code == "success") {
            resolve(res.data);
          } else {
            reject(res);
          }
        } catch (e) {
          console.log(e);
        }
      })
      .catch((error) => {
        // if (error.code == "ERR_BAD_RESPONSE") {
        //   //  showToast('服务器异常')
        // }
        return reject(error);
      });
  });
}
export function post(url: string, data = {}, config = {}) {
  const conf = Object.assign({}, config, {
    method: "post",
    url,
    data,
  });
  return request(conf);
}
export function get(url: string, params = {}, config = {}) {
  const conf = Object.assign({}, config, {
    method: "get",
    url,
    params,
  });
  return request(conf);
}
export function put(url: string, data = {}, config = {}) {
  const conf = Object.assign({}, config, {
    method: "put",
    url,
    data,
  });
  return request(conf);
}
export function del(url: string, params = {}, config = {}) {
  const conf = Object.assign({}, config, {
    method: "delete",
    url,
    params,
  });
  return request(conf);
}

export function login(data = {}) {
  return post("/api/goat/v1/auth/login", data);
}

export function changePassword(data = {}) {
  return post("/api/goat/v1/user/password", data);
}

export function logout(data = {}) {
  return post("/api/goat/v1/auth/login_out", data);
}

export function getUserList(data = {}) {
  return post("/api/goat/v1/user/list", data);
}

export function addUser(data = {}) {
  return post("/api/goat/v1/user/add", data);
}

export function editUser(data = {}) {
  return post("/api/goat/v1/user/update", data);
}

export function deleteUser(data = {}) {
  return post("/api/goat/v1/user/delete", data);
}

export function getChannelList(data = {}) {
  return post("/api/goat/v1/channel/list", data);
}

export function addChannel(data = {}) {
  return post("/api/goat/v1/channel/add", data);
}
export function editChannel(data = {}) {
  return post("/api/goat/v1/channel/update", data);
}


export  function deleteChannel(data = {}) {
  return post("/api/goat/v1/channel/delete", data);
}


export function getColumnList(data = {}) {
  return post("/api/goat/v1/column/list", data);
}
export function addColumn(data = {}) {
  return post("/api/goat/v1/column/add", data);
}
export function editColumn(data = {}) {
  return post("/api/goat/v1/column/update", data);
}

export function deleteColumn(data = {}) {
  return post("/api/goat/v1/column/delete", data);
}

export function getContentList(data = {}) {
  return post("/api/goat/v1/content/list", data);
}
export function getColumnContentList(data = {}) {
  return post("/api/goat/v1/column/content/list", data);
}
export function sortColumnContent(data = {}) {
  return post("/api/goat/v1/column/content/sort", data);
}
export function deleteColumnContent(data = {}) {
  return post("/api/goat/v1/column/content/delete", data);
}

export function distributeColumnContent(data = {}) {
  return post("/api/goat/v1/column/content/distribute", data);
}
export function deleteContent(data = {}) {
  return post("/api/goat/v1/content/delete", data);
}


export function distributeContent(data = {}) {
  return post("/api/goat/v1/content/distribute", data);
}

export function addContent(data = {}) {
  return post("/api/goat/v1/content/add", data);
}
export function editContent(data = {}) {
  return post("/api/goat/v1/content/update", data);
}