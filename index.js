import React, { Component } from 'react';
import { View, Text, Modal, VirtualizedList, Image, StyleSheet, TouchableOpacity, TextInput, SafeAreaView } from 'react-native';
import _ from 'underscore';

const countriesJson = require('./assets/countries.json');
const backArrow = require('./assets/back.png');
const close = require('./assets/close.png');
const search = require('./assets/search.png');
const countries = Object.values(countriesJson);

export default class CountryPicker extends Component {

    static defaultProps = {
        emptySearchMsg: "Can't find this country...",
        flagStyle: { width: 35, height: 25, marginRight: 20, borderRadius: 5 },
        componentTitle: 'Select a Country',
        containerStyle: { flex: 1 },
        animationType: "slide",
        emptyMessageStyle: { textAlign: 'center', marginTop: 50, fontSize: 22 },
        countryTextColor: "black",
        itemStyle: { paddingVertical: 20, paddingHorizontal: 20, flexDirection: 'row', alignItems: 'center' }
    };

    constructor() {
        super();
        this.state = {
            showSearch: true,
            countryName: '',
            countries
        }
        this.searchInput = null;

    }

    searchCountry = _.debounce((text) => {
        let countryData = [...countries];
        let filteredCountries = countryData.filter((country) => {
            return country.name.common && country.name.common.toLowerCase().indexOf(text.toLowerCase()) >= 0
        });
        this.setState({ countries: filteredCountries, countryName: text })
    }, 300)

    componentDidMount() {
        setTimeout(() => {
            this.focusSearch()
        }, 500);
    }

    focusSearch() {
        this.searchInput.focus()
    }

    render() {
        return (
            <Modal
                animationType={this.props.animationType}
                transparent={false}
                visible={true}
                style={this.props.containerStyle}
                onRequestClose={() => {
                    this.props.onHide()
                }}
            >
                <SafeAreaView>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => this.props.onHide()}>
                            <Image source={backArrow} style={{ height: 30, width: 30 }} />
                        </TouchableOpacity>
                        {
                            this.state.showSearch ?
                                <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', paddingRight: 30 }}>
                                    <TextInput
                                        ref={(e) => { this.searchInput = e; }}
                                        placeholderTextColor="#aaa"
                                        placeholder='Search country...'
                                        style={styles.countryNameInput}
                                        value={this.state.countryName}
                                        onChangeText={(text) => { this.setState({ countryName: text }, () => { this.searchCountry(text) }) }}
                                    />
                                    <TouchableOpacity onPress={() => this.setState({ showSearch: false, countryName: '', countries })}>
                                        <Image source={close} style={{ height: 30, width: 30 }} />
                                    </TouchableOpacity>
                                </View>
                                :
                                <>
                                    <Text style={{ color: 'white', fontSize: 22 }}>{this.props.componentTitle}</Text>
                                    <TouchableOpacity onPress={() => this.setState({ showSearch: true }, () => { this.focusSearch() })}>
                                        <Image source={search} style={{ height: 30, width: 30 }} />
                                    </TouchableOpacity>
                                </>
                        }

                    </View>
                    <VirtualizedList
                        keyboardShouldPersistTaps={'handled'}
                        data={this.state.countries}
                        initialNumToRender={20}
                        maxToRenderPerBatch={20}
                        getItem={(data, index) => data[index]}
                        getItemCount={data => data.length}
                        keyExtractor={(item, index) => {
                            return `${item.callingCode}${index}`
                        }}
                        ListEmptyComponent={() => (
                            <Text style={this.props.emptyMessageStyle}>{this.props.emptySearchMsg}</Text>
                        )}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => this.props.setCountryData({ callingCode: item.callingCode, countryImage: item.flag })}
                                    style={this.props.itemStyle}>
                                    <Image source={{ uri: item.flag }} style={this.props.flagStyle} />
                                    <Text style={{ color: this.props.countryTextColor }}>{item.name.common}  (+{item.callingCode})</Text>
                                </TouchableOpacity>
                            )
                        }}
                    />
                </SafeAreaView>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    header: {
        height: 70,
        paddingHorizontal: 15,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'black'
    },
    countryNameInput: {
        marginLeft: 20,
        flex: 1,
        fontSize: 18,
        color: 'white'
    }
})
