// 表格日期
export const formatDate = (dateStr) => {
  // 空值检查，空返回字符串
    if (!dateStr) return "";
    // new Date() 会正确解析出各个时间组件（年、月、日、时、分、秒、毫秒），并返回一个 Date 对象。
    const date = new Date(dateStr);
    const year = date.getFullYear();
    // 返回月份（0-11），其中0表示1月，11表示12月
    // String(...).padStart(2, "0") 将数字转换为字符串并确保它的长度至少为2，如果长度不足，则在前面添加零。例如，1 会变成 01。
    const month = String(date.getMonth() + 1).padStart(2, "0"); // 补零
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // 当你调用 new Date("2024-07-31T11:25:31.494+08:00") 时，JavaScript 根据 ISO 8601 标准，自动解析这个字符串：
  // getDate()：返回月份中的日（1-31）。
  // getHours()：返回小时（0-23）。
  // getMinutes()：返回分钟（0-59）。
  // getSeconds()：返回秒数（0-59）