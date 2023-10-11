import useAppStore from "@/store/app";
import { ElMessage } from "element-plus";
import { asyncRoutes } from "@/router";
import router from "@/router";
import { menusPermissionByUser } from "@/api/permission";
import Layout from "@/layout/index.vue";
import { app } from "@/store";
// const appStore = useAppStore();

let params = {
  appid: 1691041354632, // 项目id
};
// menusPermissionByUser(params).then((res) => {
//   if (res.code == 200) {
//     let menuPermissions = res.data.menuPermissions; // 菜单权限数据
//     let buttonPermissions = res.data.buttonPermissions; // 按钮权限数据

//     formatRoute(menuPermissions);
//     formatButton(buttonPermissions);

//   }

// });

let res = await menusPermissionByUser(params);
let menuPermissions = res.data.menuPermissions; // 菜单权限数据
let buttonPermissions = res.data.buttonPermissions; // 按钮权限数据
formatRoute(menuPermissions);
formatButton(buttonPermissions);

// 初始化菜单权限
function formatRoute(menuPermissions) {
  let serializeRoutes = menuPermissions.map((item) => {
    let flag =
      item.children && item.children.length > 0
        ? item.children.some((item2) => item2.visible)
        : true;
    if (flag) {
      let path = item.path;
      item.path = "";
      if (item.crumb) {
        return {
          path,
          component: Layout,
          children: [item],
          isHavePermission: item.isHavePermission,
        };
      } else {
        return {
          path,
          children: [item],
          isHavePermission: item.isHavePermission,
        };
      }
    } else {
      item.component = Layout;
      item.meta = {
        title: item.name,
        icon: item.icon,
      };
      return item;
    }
  });

  setFirstRouter(serializeRoutes);
  changeRouterFormat(serializeRoutes);
  setRouterParams(serializeRoutes);
  setDefaultRoute();

  let addRouteList = [...asyncRoutes, ...serializeRoutes];

  addRouteList.forEach((item) => {
    router.addRoute(item);
  });

  router.options.routes.push(...addRouteList);

  // appStore.updateRoutes(router.options.routes);

  function setFirstRouter(list) {
    list.forEach((item) => {
      if (item.children) {
        item.children.forEach((item2) => {
          if (!item2.visible) {
            let upperPath = item.file_path ? item.file_path : item.path;
            let nextPath =
              item2.path.slice(0, 1) == "/"
                ? item2.path
                : item2.path
                ? `/${item2.path}`
                : "";
            item2.file_path = upperPath + nextPath;
          } else {
            item2.activeMenu = item.file_path;
            item2.breadcrumb = item.name;
          }
          setFirstRouter(item.children);
        });
      }
    });
  }

  function changeRouterFormat(list) {
    list.forEach((item) => {
      if (item.children) {
        let aList = item.children.filter((item2) => item2.visible);
        let bList = item.children.filter((item2) => !item2.visible);
        list.push(...aList);
        item.children = bList.length > 0 ? bList : null;
      }
      item.children ? changeRouterFormat(item.children) : "";
    });
  }

  function setRouterParams(list) {
    let nameArr = [];
    // 设置路由各项参数
    list.forEach((item) => {
      item.meta = {
        title: item.name,
        icon: item.icon,
        keepAlive: item.keepAlive,
        activeMenu: item.activeMenu ? item.activeMenu : "",
        breadcrumb: item.breadcrumb ? [{ title: item.breadcrumb }] : "",
        // hideTitle: !item.crumb
      };
      item.visible ? (item.meta.hidden = true) : "";
      !item.children ? delete item.children : "";
      if (item.file_path) {
        // 设置路由对象name属性
        let nonParamPath = item.file_path.split("/:")[0];
        let arr = nonParamPath.split("/");
        arr = arr.filter((item) => item);
        let name = arr.join("_");
        if (nameArr.indexOf(name) != -1) {
          return;
        }
        item.name = name;
        nameArr.push(item.name);
      }

      if (item.path.includes("*")) {
        // 匹配到*跳转到外部链接
        if (item.path.includes("http")) {
          item.path = item.path.split("*")[1];
        } else {
          item.path = location.origin + item.path.split("*")[1];
        }
      }

      if (item.isHavePermission) {
        let componentName = item.filePath || item.file_path || "";
        componentName = componentName.split("/");
        componentName = componentName.filter((item) => item);

        if (componentName.length == 1) {
          item.file_path
            ? (item.component = () =>
                import(`@/views/${componentName[0]}/index.vue`))
            : "";
        }
        if (componentName.length == 2) {
          item.file_path
            ? (item.component = () =>
                import(
                  `@/views/${componentName[0]}/${componentName[1]}/index.vue`
                ))
            : "";
        }

        if (componentName.length == 3) {
          item.file_path
            ? (item.component = () =>
                import(
                  `@/views/${componentName[0]}/${componentName[1]}/${componentName[2]}/index.vue`
                ))
            : "";
        }
        if (componentName.length == 4) {
          item.file_path
            ? (item.component = () =>
                import(
                  `@/views/${componentName[0]}/${componentName[1]}/${componentName[2]}/${componentName[3]}/index.vue`
                ))
            : "";
        }
        if (componentName.length == 5) {
          item.file_path
            ? (item.component = () =>
                import(
                  `@/views/${componentName[0]}/${componentName[1]}/${componentName[2]}/${componentName[3]}/${componentName[4]}/index.vue`
                ))
            : "";
        }
      } else {
        item.file_path
          ? (item.component = () =>
              import(`@/components/noPermission/index.vue`))
          : "";
      }

      if (item.children) {
        item.children.forEach((item2) => {
          if (item2.visible) {
            let upperPath = item.file_path ? item.file_path : item.path;
            let nextPath =
              item2.path.slice(0, 1) == "/"
                ? item2.path
                : item2.path
                ? `/${item2.path}`
                : "";
            item2.file_path = upperPath + nextPath;
          }
        });

        setRouterParams(item.children);
      }
    });
  }

  // 设置默认菜单数据
  function setDefaultRoute() {
    if (serializeRoutes.length > 0) {
      let character = serializeRoutes[0].children[0].path ? "/" : "";
      asyncRoutes.unshift({
        path: "/",
        redirect:
          serializeRoutes[0].path +
          character +
          serializeRoutes[0].children[0].path,
      });
    } else {
      // 没有权限数据
      asyncRoutes.unshift({
        path: "/",
        component: () => import("@/components/noPermission/index.vue"),
      });
    }
    // serializeRoutes.push(
    //   {
    //     path: "/404",
    //     component: () => import("@/components/404/index.vue"),
    //     meta: { hidden: true },
    //   },
    //   { path: "/:catchAll(.*)", redirect: "/404", meta: { hidden: true } }
    // );
  }
}

// 初始化按钮权限
function formatButton(buttonPermissions) {
  let buttonPermissionsObj = {};
  buttonPermissions.forEach((item) => {
    buttonPermissionsObj[item.id] = item.hideOrGray;
  });

  let haveButtonPermissionsIds = buttonPermissions.filter(
    (item) => item.isHavePermission
  );
  haveButtonPermissionsIds = haveButtonPermissionsIds.map((item) => item.id);

  app.directive("auth", {
    mounted: function (el, binding, vnode) {
      const btn_value = binding.value;
      if (haveButtonPermissionsIds.includes(btn_value)) return;
      if (buttonPermissionsObj[btn_value] == 1) {
        el.remove();
      } else {
        el.addEventListener("click", function (e) {
          ElMessage({
            message: "暂无权限哦！",
            type: "warning",
          });
          return;
        });
        el.title = "暂无权限";
        el.disabled = true;
        el.classList.add("is-disabled");
        // vnode.componentInstance.handleClick = function (e) {};
        // vnode.componentInstance.handleChange = function () {};

        // if (el.style.color == "rgb(245, 108, 108)") {
        //   el.style.color = "#ccc";
        // }
      }
    },
  });
}
