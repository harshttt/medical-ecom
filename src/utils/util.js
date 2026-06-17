/* eslint-disable */
import commonObj from "../commonObj";

class util {
  checkRightAccess = (key) => {
    console.log("Received key:", key);
    console.log("commonObj:", commonObj);

    if (!key) {
      return commonObj.userType === "superAdmin";
    }
    if (typeof key === "string") {
      return (
        commonObj.userType === "superAdmin" ||
        commonObj?.adminRights?.includes(key)
      );
    }
  };

  // ...your existing methods

  hasAccess = (allowedRoles = []) => {
    const roles = this.constants()?.ROLES || {};

    // 👇 current logged-in role (number like 1,2,3,4)
    // console.log("commonObj Type:", commonObj.userType);
    const currentRole = Number(commonObj.userType) || roles.ADMIN;
    console.log("Current Role:", currentRole);
    console.log("Allowed Roles:", allowedRoles);
    console.log("All Roles:", roles);

    if (!allowedRoles || allowedRoles.length === 0) return true;

    return allowedRoles.includes(currentRole);
  };

  constants = () => {
    console.log("commonObj", commonObj);
    return commonObj.constants || {};
  };
  getRoles = () => {
    // fallback empty object if constants not set
    return this.constants()?.ROLES || {};
  };

  setUserData = (data) => {
    console.log("setUserData", data);
    window.localStorage.clear();
    window.localStorage.setItem("authorization", data.data.accessToken);
    // window.localStorage.setItem('type', data.user.role);
  };
  setShipRocketApiUserData = (data) => {
    window.localStorage.removeItem("ship-authorization");
    window.localStorage.setItem("ship-authorization", data.token);
  };
  getUserData = ($key) => {
    if ($key) {
      return JSON.parse(window.localStorage["user"])[$key];
    } else {
      return JSON.parse(window.localStorage["user"]);
    }
  };
  setUserType = (data = "") => {
    window.localStorage.setItem("type", data);
  };
  userType = () => window.localStorage["type"];
  getToken = () => {
    return window.localStorage["authorization"] || "";
  };
  getShipToken = () => {
    return window.localStorage["ship-authorization"] || "";
  };
  isLogged = () => {
    if (
      typeof window.localStorage["authorization"] !== "undefined" &&
      window.localStorage["authorization"] !== ""
    ) {
      return true;
    }
    return false;
  };

  logout = (e) => {
    if (e) e.preventDefault();
    window.localStorage.clear();
    window.location.reload();
  };

  setTheme($theme = "light") {
    window.localStorage.setItem("theme", $theme);
    return $theme;
  }
  getTheme() {
    return window.localStorage?.theme;
  }
  removeSpecialChars(key) {
    return key
      ?.trim()
      .toLowerCase()
      ?.replace(/[^a-z0-9 _-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }
  handleInteger($str, $len = 10) {
    let num = $str?.replace(/[^0-9]/g, "");
    return $len ? num?.substring(0, $len) : num;
  }
  handleFloat(value, maxValue) {
    value = value.replace(/[^0-9.]/g, "");
    let newValue = value.replace(/[\.\%]/g, function (match, offset, all) {
      return match === "." ? (all.indexOf(".") === offset ? "." : "") : "";
    });
    if (maxValue) {
      if (newValue * 1 > maxValue * 1) {
        newValue = maxValue;
      }
    }
    return newValue;
  }
  toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }
  queryStringToJSON(qs) {
    qs = qs || window.location.search.slice(1);
    if (qs.charAt(0) === "?") {
      qs = qs.slice(1);
    }

    var pairs = qs.split("&");
    var result = {};
    pairs.forEach(function (p) {
      var pair = p.split("=");
      var key = pair[0];
      var value = decodeURIComponent(pair[1] || "");
      if (result[key]) {
        if (Object.prototype.toString.call(result[key]) === "[object Array]") {
          result[key].push(value);
        } else {
          result[key] = [result[key], value];
        }
      } else {
        result[key] = value;
      }
    });

    return JSON.parse(JSON.stringify(result));
  }
  getFileFormat(data) {
    const hashUid = (url) => {
      // Simple hash based UID generator
      let hash = 0;
      for (let i = 0; i < url.length; i++) {
        hash = (hash << 5) - hash + url.charCodeAt(i);
        hash |= 0; // Convert to 32bit integer
      }
      return `uid-${Math.abs(hash)}`;
    };

    if (data?.url) {
      return [
        {
          uid: hashUid(data.url),
          url: data.url,
        },
      ];
    }

    if (typeof data === "string") {
      return [
        {
          uid: hashUid(data),
          url: data,
        },
      ];
    }

    if (Array.isArray(data)) {
      const seen = new Set();
      return data
        .filter((v) => {
          const url = typeof v === "string" ? v : v?.url;
          if (seen.has(url)) return false;
          seen.add(url);
          return true;
        })
        .map((v) => {
          const url = typeof v === "string" ? v : v?.url;
          return {
            uid: hashUid(url),
            url,
          };
        });
    }

    return [];
  }

  convertToCommaSeperatedValue(number = "0") {
    const reversedNumber = number.toString().split("").reverse().join("");
    const parts = reversedNumber.match(/.{1,3}/g);
    const formatedNumber = parts.join(",");
    return formatedNumber.split("").reverse().join("");
  }
}

export default new util();
