import type { LinksFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import {
  Form,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
 // Link,
  useLoaderData,
  NavLink,
  useNavigation,
} from "@remix-run/react";

import { getContacts, createEmptyContact } from "./data";
export const action= async ()=>{// este action llama la funcion From del metodo post del boton submits
  const contact = await createEmptyContact();
  return redirect(`/contacts/${contact.id}/edit`);
}

export const loader = async()=>{
  const contacts = await getContacts();
  return json({contacts})
}
import appStylesHref from "./app.css?url";

export const links:LinksFunction = ()=>[
{rel:"stylesheet", href: appStylesHref}
];

export default function App() {
  const {contacts}=useLoaderData<typeof loader>();//la variable no se llena hasta que este codigo se dibuje
  const navigation =useNavigation();
  return (
    <html lang="es">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <div id="sidebar">
          <h1>Remix Contacts</h1>
          <div>
            <Form id="search-form" role="search">
              <input
                id="q"
                aria-label="Search contacts"
                placeholder="Search"
                type="search"
                name="q"
              />
              <div id="search-spinner" aria-hidden hidden={true} />
            </Form>
            <Form method="post">
              <button type="submit">New</button>
            </Form>
          </div>
          <nav>
          {contacts.length ? (
<ul>
{contacts.map((contact) => (
<li key={contact.id}>
<NavLink 
className={
 ({isActive,isPending})=>
  isActive ? "active" : isPending ? "pending" :"" 
}
to={`contacts/${contact.id}`}>
{contact.first || contact.last ? (
<>
{contact.first} {contact.last}
</>
) : (
<i>Sin Nombre</i>
)}{" "}
{contact.favorite ? (
<span>★</span>
) : null}
</NavLink>
</li>
))}
</ul>
) : (
<p>
<i>No contacts</i>
</p>
)}
          </nav>
        </div>
        <div className={
          navigation.state==="loading" ? "loading" : ""
        } 
        id="detail">
          <Outlet/>
        </div>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}
