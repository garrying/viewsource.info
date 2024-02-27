export const consoleGraphic = () => {
  if (
    typeof console !== "undefined" &&
    typeof console.log === "function" &&
    !window.test
  ) {
    console.log(
      `
    %c┌────────────────────────────────────────────┐
    %c│                                            │
    %c│             WEB                            │
    %c│            PAGE                            │
    %c│                                            │
    %c│             xxx               <URL>        │
    %c│           xx   xx      xx                  │
    %c│          xx     xx    xxxxxx        <URL>  │
    %c│        xx        xx  xx    xx              │
    %c│      xxx          xxxx      xxxxxxx        │
    %c│xxxxxxx            xxx        xx   x x      │
    %c│                 xx                xxx  x   │
    %c│                               xxxxx  xxxxxx│
    %c│   <URL>               xxxxxxxxx   xxxx     │
    %c│                       x        xxxx        │
    %c│            xxxxxxxxxxxx    xxxxx           │
    %c│          xxx             xxx               │
    %c│        xxx              xx                 │
    %c└────────────────────────────────────────────┘

    a view source web

    Garry Ing (https://garrying.com)
    issue 03, spring 2024, the html review (https://thehtml.review)

    The text on this website is a reflection on view source and the 
    feeling of viewing HTML before browser developer tools.

    The ability to inspect elements and debug JavaScript was introduced 
    in 2006 through a Firefox extension called Firebug. Read more about
    its development and earlier tools like Aardvark and Venkman at 
    https://thehistoryoftheweb.com/checking-under-the-hood-of-code/
    `,
      "color:#4d5eff",
      "color:#5363ff",
      "color:#5969ff",
      "color:#5f6eff",
      "color:#6574ff",
      "color:#6b79ff",
      "color:#717eff",
      "color:#7784ff",
      "color:#7d89ff",
      "color:#838fff",
      "color:#8894ff",
      "color:#8e99ff",
      "color:#949fff",
      "color:#9aa4ff",
      "color:#a0aaff",
      "color:#a6afff",
      "color:#acb4ff",
      "color:#b2baff",
      "color:#b8bfff"
    );
  }
};
