
export interface Menu {
    [category: string]: Article[]
}
  
export interface Article {
    name: string,
    variations: string[],
    image: string,
    url: string,
    price: string
}

export interface MenuVariationSelect {
    [category: string]: [article: string] 
}

export interface Cart {
    [category: string]: [article: string[]]
}

export interface CartListItem {
    menu: Article,
    cart: string[],
    category: string,
    item: string
}