import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import './assignment.css';
import $ from 'jquery';

var defaultState = {
  product: {
    items: [],
    single: null
  }
};


function addProduct(name,description,image,price,category,quantity) {
 return {
   type: 'ADD_PRODUCT',
   name: name,
   description: description,
   image: image,
   price: price,
   category: category,
   quantity: quantity,
 };
}


function deleteProduct(index) {
  return {
    type: 'DELETE_PRODUCT',
    index: index,
  };
}


function updateProduct(index,name,description,price,quantity) {
  return {
    type: 'UPDATE_PRODUCT',
    index: index,
    name:name,
    description: description,
    price:price,
    quantity:quantity
  };
}

function clearProduct() {
  return {
    type: 'CLEAR_PRODUCT',
  };
}

function filterLowPrice(){
  return {
    type: 'FILTER_LOW',
  };
}

function filterHighPrice(){
  return {
    type: 'FILTER_HIGH',
  };
}

function viewProduct(index){
  return {
    type: 'VIEW_PRODUCT',
    index: index
  };
}

function productApp(state, action) {
  switch (action.type) {
    case 'ADD_PRODUCT':
      var newState = Object.assign({}, state);
      newState.product.items.push({
        name: action.name,
        description: action.description,
        image: action.image,
        price: action.price,
        category: action.category,
        quantity: action.quantity,
      });
      return newState;


    case 'DELETE_PRODUCT':
      var items = [].concat(state.product.items);
      items.splice(action.index, 1);
      return Object.assign({}, state, {
        product: {
          items: items
        }
      });

    case 'UPDATE_PRODUCT':
    var name = prompt("Please enter new name for this product", action.name);
    var description = prompt("Please enter new description for this product", action.description);
    var price = prompt("Please enter new price for this product", action.price);
    var quantity = prompt("Please enter new quantity for this product", action.quantity);
    var newState = Object.assign({}, state);
    if(name==null){
      name=action.name;
    }
    if(description==null){
      description=action.description;
    }
    if(price==null){
      price=action.price;
    }
    if(quantity==null){
      quantity=action.quantity;
    }
    newState.product.items[action.index].name=name;
    newState.product.items[action.index].description=description;
    newState.product.items[action.index].price=price;
    newState.product.items[action.index].quantity=quantity;
    return newState;

    case 'CLEAR_PRODUCT':
      var newState = Object.assign({}, state);
      newState.product.items = [];
      return newState;

    case 'FILTER_LOW':
      var items =[].concat(state.product.items);
      items.sort(function(a,b){return a.price-b.price})
      return Object.assign({}, state,{
        product: {
            items:items
        }
      });

    case 'FILTER_HIGH':
      var items =[].concat(state.product.items);
      items.sort(function(b,a){return a.price-b.price})
      return Object.assign({}, state,{
        product: {
            items:items
        }
      });


    case 'VIEW_PRODUCT':
      var newState = Object.assign({}, state);
      newState.product.single = action.index;
      return newState;

    default:
      return state;
  }
};

var store = createStore(productApp, defaultState);


class ClearButton extends React.Component {
  onClearClick() {
    store.dispatch(clearProduct());
  }
  render() {
    return (
      <button id='clearBtn' onClick={this.onClearClick.bind(this)}> Clear </button>
    );
  }
  }

  class FilterLowButton extends React.Component{
    onFilterLowClick(){
      store.dispatch(filterLowPrice());
    }
    render(){
      return(
        <button id="lowPriceBtn" onClick={this.onFilterLowClick.bind(this)}> &darr; Price </button>
      );
    }
  }

  class FilterHighButton extends React.Component{
    onFilterHighClick(){
      store.dispatch(filterHighPrice());
    }
    render(){
      return(
        <button id='highPriceBtn' onClick={this.onFilterHighClick.bind(this)}> &uarr; Price </button>
      );
    }
  }

class AddProductForm extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      name: '', description: '', image: '', price: '',
      category: '', quantity: ''
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.onFormSubmit=this.onFormSubmit.bind(this);
  }

  onFormSubmit(e) {
    e.preventDefault();
    store.dispatch(addProduct(this.state.name, this.state.description,
      this.state.image, this.state.price, this.state.category,
      this.state.quantity ));
    this.setState({ name: '', description: '', image: '', price: '',
    category: '', quantity: '' });
  }

  handleInputChange(e) {
    var value = e.target.value;
    var name = e.target.name;
    this.setState({
      [name]: value
    });
  }
  render() {
    return (
      <form onSubmit={this.onFormSubmit}>
      <label>
        Product Name : &nbsp;
        <input name="name" type="text" value={this.state.name} onChange={this.handleInputChange} required/>
      </label>
      <br/><br/>
      <label>
        Description : &nbsp;
        <textarea name="description" value={this.state.description} onChange={this.handleInputChange} required/>
      </label>
      <br/><br/>
      <label>
      Image : &nbsp;
        <input id='picInputBtn' name="image" type="file" value={this.state.image} onChange={this.handleInputChange} accept="image/*"  required/>
      </label>
      <br/><br/>
      <label>
          Price : &nbsp;
        <input name="price" type="number" step="any" min="0" value={this.state.price} onChange={this.handleInputChange} required/>
      </label>
      <br/><br/>
      <label>
        Category : &nbsp;
        <select name="category" value={this.state.category} onChange={this.handleInputChange}>
          <option value="None">None</option>
          <option value="Food">Food</option>
          <option value="Handcraft Item">Handcraft Item</option>
          <option value="Homemade Item">Homemade Item</option>
        </select>
      </label>
      <br/><br/>
      <label>
        Quantity : &nbsp;
        <input name="quantity" type="number" value={this.state.quantity} onChange={this.handleInputChange} required/>
      </label>
        <br/><br/>
        <input type="submit" value="Add" id='addBtn' />
      </form>
    );
  }
}


class ProductRow extends React.Component {

  onDeleteClick() {
    store.dispatch(deleteProduct(this.props.index));
  }

  onUpdateClick() {
    store.dispatch(updateProduct(this.props.index, this.props.name, this.props.description, this.props.price, this.props.quantity));
    alert('Update successfully');
  }

  onViewClick() {
    store.dispatch(viewProduct(this.props.index));
  }

  render() {
    var item = this.props.item;

    return (
      <tr>
        <td>{item.name}</td>
        <td>{item.description}</td>
        <td>{item.category}</td>
        <td>{item.price}</td>
        <td>{item.quantity}</td>
        <td><button id='delBtn' type="button" onClick={this.onDeleteClick.bind(this)}
           style={{textDecoration: 'none'}}>
         Delete</button>
         &nbsp;&nbsp;
          <button id='updateBtn' type="button" onClick={this.onUpdateClick.bind(this)}>
          Update</button>
          &nbsp;&nbsp;
          <button id='viewBtn' type="button" onClick={this.onViewClick.bind(this)}>
           View</button>
        </td>
      </tr>
    );
  }
}

class ProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
  }

  componentWillMount() {
    store.subscribe(() => {
      var state = store.getState();
      this.setState({
        items: state.product.items
      });
    });
  }


  render() {
    var items = [];

    var filterText = this.props.filterText;
    var food = this.props.food;
    var handcraft = this.props.handcraft;
    var homemade = this.props.homemade;

    this.state.items.forEach((item, index) => {
      if (item.name.indexOf(filterText) === -1) {
        return ;
      }
      if (food && item.category!='Food') {
        return;
      }
      if (handcraft && item.category!='Handcraft Item') {
        return;
      }
      if (homemade && item.category!='Homemade Item') {
        return;
      }

      items.push(<ProductRow
        key={index}
        item={item}
        index={index}
        name={item.name}
        description={item.description}
        price={item.price}
        quantity={item.quantity}
        />
    );
    });

    if (!items.length) {
      return (
        <p>
          <i>Empty product list. Please add a product!</i>
        </p>
      );
    }

    return (
      <div id="table">
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Category</th>
            <th>Price</th>
            <th>Quantity</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>{items}</tbody>
      </table>
      </div>
    );
  }
}

class ProductDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items:[],
      single: null
    };
  }

  componentWillMount() {
    store.subscribe(() => {
      var state = store.getState();
      this.setState({
        items:state.product.items,
        single: state.product.single
      });
    });
  }

  render() {
    var item = this.state.items[this.state.single];

    if (item==null) {
      return (
        <div>
          <i>No product selected !</i>
          <br/><br/>
          <img height='250px' width='300px' src="src\img\magnifier1.png" />
        </div>
      );
    }
    item.image=item.image.replace("C:\\fakepath\\", "src\\img\\");
    return (
      <div>
        <div className='imageDisplay'> <img src={item.image} height='350px' width='350px'/> </div>
        <br/>
        <p><img src='src/img/staricon.png' height='20px' width='20px'/> Name : {item.name} </p>
        <p><img src='src/img/staricon.png' height='20px' width='20px'/> Description:{item.description} </p>
        <p><img src='src/img/staricon.png' height='20px' width='20px'/> Category : {item.category} </p>
        <p><img src='src/img/staricon.png' height='20px' width='20px'/> Price : {item.price} </p>
        <p><img src='src/img/staricon.png' height='20px' width='20px'/> Quantity : {item.quantity} </p>
      </div>
    );
  }
}


class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleFoodChange = this.handleFoodChange.bind(this);
    this.handleHandcraftChange = this.handleHandcraftChange.bind(this);
    this.handleHomemadeChange = this.handleHomemadeChange.bind(this);
  }

  handleFilterTextChange(e) {
    this.props.onFilterTextChange(e.target.value);
  }

  handleFoodChange(e) {
    this.props.onFoodChange(e.target.checked);
  }

  handleHandcraftChange(e) {
    this.props.onHandcraftChange(e.target.checked);
  }

  handleHomemadeChange(e) {
    this.props.onHomemadeChange(e.target.checked);
  }

  render() {
    return (
      <form>
      <label>
      Search Bar: &nbsp; &nbsp;
        <input
          type="text"
          placeholder="Search Product"
          value={this.props.filterText}
          onChange={this.handleFilterTextChange}
        />
        </label>
        <br /> <br/>
        <label>
        Category Filter :
        <p>
          <input
            type="checkbox"
            checked={this.props.food}
            onChange={this.handleFoodChange}
          />
          {' '}
          Food
          &nbsp; &nbsp;
          <input
            type="checkbox"
            checked={this.props.handcraft}
            onChange={this.handleHandcraftChange}
          />
          {' '}
          Handcraft Item
          &nbsp; &nbsp;
          <input
            type="checkbox"
            checked={this.props.homemade}
            onChange={this.handleHomemadeChange}
          />
          {' '}
          Homemade Item
        </p>
        </label>
      </form>
    );
  }
}

class FilterableProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      food: false,
      handcraft: false,
      homemade: false,
    };

    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleFoodChange = this.handleFoodChange.bind(this);
    this.handleHandcraftChange = this.handleHandcraftChange.bind(this);
    this.handleHomemadeChange = this.handleHomemadeChange.bind(this);
  }


  handleFilterTextChange(filterText) {
    this.setState({
      filterText: filterText
    });
  }

  handleFoodChange(food) {
    this.setState({
      food: food
    })
  }

  handleHandcraftChange(handcraft) {
    this.setState({
      handcraft: handcraft
    })
  }

  handleHomemadeChange(homemade) {
    this.setState({
      homemade: homemade
    })
  }

  render() {
    return (
      <div>
        <SearchBar
          filterText={this.state.filterText}
          food={this.state.food}
          handcraft={this.state.handcraft}
          homemade={this.state.homemade}
          onFilterTextChange={this.handleFilterTextChange}
          onFoodChange={this.handleFoodChange}
          onHandcraftChange={this.handleHandcraftChange}
          onHomemadeChange={this.handleHomemadeChange}
        />
        <ProductList
          items={this.props.items}
          filterText={this.state.filterText}
          food={this.state.food}
          handcraft={this.state.handcraft}
          homemade={this.state.homemade}
        />
      </div>
    );
  }
}

ReactDOM.render(
  <div>
  <h1 className="mainpagetitle"><img src='src/img/title.png' height='250px'/></h1>
  <div className="flex-container">
  <div className="flex-item">
  <h2>Product Form</h2>
  <br/>
    <AddProductForm />
  </div>
  <div className="flex-item">
  <h2>Product List</h2>
    <FilterableProductTable />
    <br/>
    <ClearButton />&nbsp; &nbsp;
    <FilterLowButton /> &nbsp; &nbsp;
    <FilterHighButton />
  </div>
  <div className="flex-item">
  <ProductDetails />
  </div>
  </div>
  </div>,
  document.getElementById('app')
);
