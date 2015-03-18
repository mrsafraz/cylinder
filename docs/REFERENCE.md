# Quick Reference

### Views and View Models

In Cylinder, user interface elements are composed of *view* and *view-model* pairs. The view is written with HTML and is rendered into the DOM. The view-model is written with JavaScript and provides data and behavior to the view. The templating engine and/or DI are responsible for creating these pairs and enforcing a predictable lifecycle for the process. Once instantiated, Cylinder's powerful databinding links the two pieces together allowing changes in your data to be reflected in the view and vice versa.

#### Dependency Injection (DI)

View-models and other interface elements are created as classes which are instantiated by the framework using a dependency injection container. Code written in this style is easy to modularize and test. Rather than creating large classes, you can break things down into small objects that collaborate to achieve a goal. The DI can then put the pieces together for you at runtime.

In order to leverage DI you simply need to add a bit of metadata to your class to tell the framwork what it should pass to its constructor. Here's an example of a view-model that depends on Aurelia's HttpClient.

```javascript
import {HttpClient} from 'aurelia-http-client';
import {Customer} from '../models';

export class CustomerDetail {
    constructor(http: HttpClient){
        // inject the HttpClient instance
        this.http = http;
    }
    findAllCustomers(){
        return new Promise((resolve, reject) => {
            // using the HttpClient instance
            this.http.get(/* .... */).then(results => {
                va customers = [];
                for(var result of results){
                    customers.push(new Customer(result));
                }
                resolve(customers);
            });
        });
    }
}
```

#### Example View Model

```javascript
import {Module} from 'framework';
import {CustomerDetail} from '_lib/customer-detail';

class MyViewModel extends Module {
    constructor(customerDetail: CustomerDetail){
        this.customerDetail = customerDetail;
        this.firstName = 'John';
        this.lastName = 'Smith';
        this.url = 'http://google.com';
        this.color = 'dimmed';
        this.isHappy = true;
        this.customers = [];
    }
    get fullName(){
        return this.firstName + ' ' + this.lastName;
    }
    sayHello($event){
    }
    activate(){
        this.customerDetail.findAllCustomers().then(customers => {
            this.customers = customers;
        });
    }
}

export default MyViewModel;
```

### Data Binding

```html
<input type="text" value.bind="firstName">
<a href.bind="url">Google</a>
<input type="checkbox" checked.bind="isHappy"> Is happy!
<button click.delegate="sayHello($event)">Say Hello</button>
```

#### delegate
Binding commands don't only connect properties and attributes, but can be used to trigger behavior. For example, if you want to invoke a method on the view-model when a button is clicked, you would use the delegate command like this:

```html
<button click.delegate="sayHello()">Say Hello</button>
```

The `$event` property can be passed as an argument to a delegated function call if you need to access the event object.

```html
<button click.delegate="sayHello($event)">Say Hello</button>
```

#### String Interpolation

Sometimes you need to bind properties directly into the content of the document or interleave them within an attribute value. For this, you can use the string interpolation syntax `${expression}`. String interpolation is a one-way binding, the output of which is converted to a string. Here's an example:

```html
<span>${fullName}</span>
```

The fullName property will be interpolated directly into the span's content. You can also use this to handle css class bindings like so:

```html
<div class="dot ${color} ${isHappy ? 'green' : 'red'}"></div>
```
In this snippet "dot" is a statically present class and "green" is present only if `isHappy` is true, otherwise the "red" class is present. Additionally, whatever the value of `color` is...that is added as class.

> **Note:** You can use simple expressions inside your bindings. Don't try to do anything too fancy. You don't want code in your view. You only want to establish the linkage between the view and its view-model.

#### if

The if Template Controller allows you to conditionally add/remove an HTML element. If the value is true, the element will also be present in the DOM, otherwise it will not.

```html
<div if.bind="isHappy">Happy!</div>
```

#### repeat

The `repeat` Template Controller allows you to render a template multiple times, once for each item in an array. Here's an example that renders out a list of customer names:

```html
<ul>
    <li repeat.for="customer of customers">${customer.fullName}</li>
</ul>
```

An important note about the repeat behavior is that it works in conjuction with the `.for` binding command. This binding command interprets a special syntax in the form "item of array" where "item" is the local name you will use in the template and "array" is a normal binding expression that evaluates to an array.

