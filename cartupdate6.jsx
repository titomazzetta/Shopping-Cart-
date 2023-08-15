

// ... Your component code

const { useState, useEffect, useReducer } = React;


// ---- Data Fetching Hook ----
// Custom hook to fetch data from an API.
// This is a more advanced pattern to handle fetch state (loading, error, success).

const useDataApi = (initialUrl, initialData, onDataFetched) => {
  const {useEffect, useReducer } = React;
  const [url, setUrl] = useState(initialUrl);

  const doFetch = (newUrl) => {
    console.log("Inside doFetch, setting URL to:", newUrl);  // <-- Add this log
    setUrl(newUrl);
};

  

  const [state, dispatch] = useReducer(dataFetchReducer, {
    isLoading: false,
    isError: false,
    data: initialData,
  });
  console.log(`useDataApi called`);


  useEffect(() => {
        let didCancel = false;
        const fetchData = async () => {
            dispatch({ type: "FETCH_INIT" });
            try {
                const result = await axios(url);
                if (!didCancel) {
                    dispatch({ type: "FETCH_SUCCESS", payload: result.data });
                    if (typeof onDataFetched === 'function') {
                        onDataFetched(result.data);
                    }
                    setUrl("http://localhost:1337/api/products/"); // Reset the URL here
                }
            } catch (error) {
                if (!didCancel) {
                    dispatch({ type: "FETCH_FAILURE" });
                }
            }
        };
        fetchData();

        return () => {
            didCancel = true;
        };
    }, [url]);
    return [state, doFetch];
};

// ---- Reducer for Data Fetching ----
// This reducer handles actions dispatched during different states of the fetch.

const dataFetchReducer = (state, action) => {
  switch (action.type) {
    case "FETCH_INIT":
      return {
        ...state,
        isLoading: true,
        isError: false,
      };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      };
    case "FETCH_FAILURE":
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    default:
      throw new Error();
  }
};

// ---- Main Product Component ----
// This component displays the products, cart and checkout details.

const Products = (props) => {

    const [cart, setCart] = React.useState({});
    const [total, setTotal] = React.useState(0);
    const [items, setItems] = useState([]);
   const [query, setQuery] = useState("http://localhost:1337/api/products");

    const [{ data, isLoading, isError }, doFetch] = useDataApi(
      query,
      {
        data: [],
      },
      (fetchedData) => {
        if (fetchedData && Array.isArray(fetchedData.data)) {
            let updatedItems = [...items];  // Start with the current product list
    
            fetchedData.data.forEach(fetchedItem => {
                let { name, country, cost, instock } = fetchedItem.attributes;

                console.log(`Processing fetched item: ${name}, stock: ${instock}`);
    
                // Find the index of the item in the current product list
                let index = updatedItems.findIndex(item => item.name === name);
                if (index !== -1) {
                    // Update the stock of the existing item
                    updatedItems[index].instock = instock;
                } else {
                    // Add the new item to the list
                    updatedItems.push({ name, country, cost, instock });
                }
            });
            setItems(updatedItems);
        } else {
            console.error("Received data format is unexpected:", fetchedData);
        }
      }
    );

    const RefreshProductsButton = () => {
        return (
            <button onClick={() => restockProducts(query)}>
                Refresh Product List
            </button>
        );
    };
    

  const {
    Card,
    Accordion,
    Button,
    Container,
    Row,
    Col,
    Image,
    Input,
  } = ReactBootstrap;

  const handleCheckout = () => {
    // Reset the cart
    setCart([]);
    
    // Update the total
    setTotal(0);

    alert("Thank you for ordering. The products ordered will arrive shortly into your imagination.");

};

  
  // Initial Fetching of Data from Strapi

 


  // Transform fetched data into the desired format



  // Check for loading and error states

if (isLoading) {
    return <div>Loading...</div>;
}

if (isError) {
    return <div>Error loading products</div>;
}




// Add item to cart, decrease its stock in products list
const addToCart = (e) => {
    let name = e.target.name;
    let selectedItem = items.find(item => item.name === name);
  
    if (selectedItem.instock <= 0) return;
  
    // Create a new cart object based on the previous cart
    let newCart = { ...cart };
  
    if (newCart[name]) {
      // If the item exists in the cart, increment its count
      newCart[name].count += 1;
    } else {
      // If the item doesn't exist in the cart, add it with a count of 1
      newCart[name] = {
        ...selectedItem,
        count: 1
      };
    }
  
    // Decrease stock of the item
    let updatedItems = items.map(item => {
      if (item.name === name) {
        return {
          ...item,
          instock: item.instock - 1
        };
      }
      return item;
    });
  
    setCart(newCart);
    setItems(updatedItems);
  };

  // Remove item from cart, increase its stock in products list
  const deleteCartItem = (name) => {
    let newCart = { ...cart };
  
    if (newCart[name].count > 1) {
      newCart[name].count -= 1;
    } else {
      delete newCart[name];
    }
  
    let newItems = items.map((item) => {
      if (item.name === name) item.instock += 1;
      return item;
    });
  
    setCart(newCart);
    setItems(newItems);
  };
  // Render list of products available for sale
  let list = items.map((item, index) => {
    let n = index + 1049;
    let uhit = "https://source.unsplash.com/random/800x800/?img=" + n;
    


    
    return (
        <Col md={10} sm={6} xs={12} key={index} className="mb-4"> {/*This grid setting will make 3 cards in a row for medium devices, 2 for small devices and 1 for extra-small devices.*/}
            <Card>
        <Card.Img 
            variant="top" 
            src={uhit} 
            style={{ 
                width: '50px', 
                height: '50px', 
                float: 'right',  // Align to the right
                margin: 'auto 0',  // Center vertically
            }} 
    />
    <Card.Body>
        <Card.Title>{item.name}</Card.Title>
        <Card.Text>
            Price: ${item.cost} <br/>
            Stock: {item.instock}
        </Card.Text>
        {item.instock > 0 
          ? <Button variant="primary" name={item.name} onClick={addToCart}>Add to Cart</Button>
          : <span>Out of Stock</span>}
    </Card.Body>
</Card>

        </Col>
      );
  });
  
  // Render items added to the cart
  let cartList = Object.keys(cart).map((name, index) => {
    let item = cart[name];
    return (
      <Card key={index}>
        <Card.Header className="d-flex justify-content-between">
             <Accordion.Toggle as={Button} variant="link" eventKey={1 + index}>
                {item.name} (x{item.count})
            </Accordion.Toggle>
            <Button variant="danger" size="sm" onClick={() => deleteCartItem(name)}>x</Button>
        </Card.Header>
        <Accordion.Collapse eventKey={1 + index}>
          <Card.Body>
            $ {item.cost} from {item.country}
          </Card.Body>
        </Accordion.Collapse>
      </Card>
    );
  });
  
  
  const calculateTotals = () => {
    // ... any other logic you need
  
    return { final, total };
  };


    // Calculate total cost of items in cart
    const checkOut = () => {
        let costs = Object.values(cart).map(item => item.cost * item.count); // This will give an array of total costs for each item
        const reducer = (accum, current) => accum + current;
        let newTotal = costs.reduce(reducer, 0);
        console.log(`total updated to ${newTotal}`);
        return newTotal;
      };
      
    // Fetch more products (restocking)
    const restockProducts = (url) => {
        const newUrl = url.endsWith("/") ? url : `${url}/?t=${Date.now()}`; // Add a random query string
        doFetch(newUrl);
    };
    

  return (
    <Container>
      <Row>
      <Col>
        <h1>Product List</h1>
        <Row> {/*This Row will contain the grid of products*/}
          {list}
        </Row>
      </Col>
        <Col>
          <h1>Cart Contents</h1>
          <Accordion>{cartList}</Accordion>
        </Col>
        <Col>
    <h1>CheckOut</h1>
  
    <Card>
        <Card.Body>
            <Card.Title>Your Total</Card.Title>
            <Card.Text>${checkOut()}</Card.Text>
            <Button onClick={handleCheckout}>Checkout</Button>
        </Card.Body>
    </Card>
</Col>

      </Row>
      <Row>
      <form
            onSubmit={(event) => {
                event.preventDefault();
                restockProducts(query);
            }}
        >
            <input
                type="text"
                value={query} 
                onChange={(event) => setQuery(event.target.value)}
            />
            <button type="submit">ReStock Products</button>
        </form>


</Row>
    </Container>
  );
};
// ========================================
ReactDOM.render(<Products />, document.getElementById("root"));
