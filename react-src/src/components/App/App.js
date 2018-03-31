import React, { Component } from 'react';
import { Container, Dropdown } from 'semantic-ui-react';

import FishPage from '../Pages/FishPage';
import PurchasePage from '../Pages/PurchasePage';
import OrderPage from '../Pages/OrderPage';
import ReportsPage from '../Pages/ReportsPage';
import logo from '../../logo.svg';

import './App.css';

import { Tab } from 'semantic-ui-react';
import LocalizedStrings from 'react-localization';

const L10 = new LocalizedStrings({
  en: {
    fishTypes: "Fish Types",
    Buy: "Buy",
    Sell: "Sell",
    Reports: "Reports",
    selectLanguage: "Select Language",
    Bangla: "বাংলা",
    welcomeMsg: 'Welcome to Fish Market',
    Name: "Name",
    Category: "Category",
    Stock: "Stock",
    FishName:"Fish Name",
    SellerName:"Seller Name",
    CustomerName: "Customer Name",
    SupplierName: "Supplier Name",
    Weight:"Weight",
    ActualWeight:"Actual Weight",
    Rate:"Rate",
    Price:"Price",
    Date:"Date",
    AddNew: "Add New",
    AddFishType: "Add Fish Type",
    BuyFish: "Buy Fish",
    PlaceAnOrder: "Place A New order",
    Add:'Add',
    Discount: 'Discount',
    SelectFishType: 'Please select a fish type',
    CurrentStock: "Current Stock",
    PurchaseSellPerMonth: "Purchase/Sales per Month",
    CompleteMsg: "Completed! Click outside to close the dialog",
    ClickTOBuy:"Click to buy",
    ClickTOSell:"Click to sell",
  },
  bn: {
    fishTypes: "মাছের ধরন",
    Buy: "কেনা",
    Sell: "বিক্রি",
    Reports: "প্রতিবেদন (Reports)",
    selectLanguage: "আপনার ভাষা নির্বাচন করুন",
    Bangla: "বাংলা",
    welcomeMsg: "মাছ বাজারে স্বাগতম",
    Name: "নাম",
    Category: "বিভাগ",
    Stock: "স্টক",
    FishName:"মাছের নাম",
    SellerName:"বিক্রেতা নাম",
    CustomerName:"ক্রেতার নাম",
    SupplierName: "সরবরাহকারী নাম",
    Weight:"ওজন",
    ActualWeight:"প্রকৃত ওজন",
    Rate:"হার",
    Price:"মূল্য",
    Date:"তারিখ",
    AddNew:"নতুন যুক্ত করুন",
    AddFishType: "মাছ টাইপ যোগ করুন",
    BuyFish: "মাছ কিনুন",
    PlaceAnOrder: "নতুন অর্ডার করুন",
    Add:'যোগ',
    Discount: 'ছাড়',
    SelectFishType: 'মাছের ধরন নির্বাচন করুন',
    CurrentStock: "বর্তমান তহবিল",
    PurchaseSellPerMonth: "ক্রয় / বিক্রয় প্রতি মাসে",
    CompleteMsg: "সম্পূর্ণ হয়েছে! ডায়ালগ বন্ধ করার জন্য বাইরে ক্লিক করুন",
    ClickTOBuy:"কেনার জন্য ক্লিক করুন",
    ClickTOSell:"বিক্রি করতে ক্লিক করুন",
  }
});

const getPanes = (L10) => {
  return [
    { menuItem: `${L10.fishTypes}`, render: () => <Tab.Pane attached={false}><FishPage L10={L10} /></Tab.Pane> },
    { menuItem: `${L10.Buy}`, render: () => <Tab.Pane attached={false}><PurchasePage L10={L10} /></Tab.Pane> },
    { menuItem: `${L10.Sell}`, render: () => <Tab.Pane attached={false}><OrderPage  L10={L10} /></Tab.Pane> },
    { menuItem: `${L10.Reports}`, render: () => <Tab.Pane attached={false}><ReportsPage L10={L10} /></Tab.Pane> },
  ];
}

const languageOptions = [{ text: 'English', value: 'en' }, { text: L10.Bangla, value: 'bn' }]

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      panes: getPanes(L10),
      selectedLanguage: '',
      L10,
    }
  }
  setLanguage(e, data) {
    L10.setLanguage(data.value);
    this.setState({ panes: getPanes(this.state.L10), L10 });
  }
  render() {
    return (
      <div className='App'>
        <div className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <div className="title"><span> {L10.welcomeMsg} </span></div>
          <div className="welcome">
            <Dropdown
              className="language-picker"
              selection
              options={languageOptions}
              placeholder={L10.selectLanguage}
              onChange={(e, d) => this.setLanguage(e, d)}
              compact
            />
          </div>
        </div>
        <Container>
          <Tab menu={{ secondary: true, pointing: true }} panes={this.state.panes} />
        </Container>
        <br />
      </div>
    );
  }
}

export default App;
