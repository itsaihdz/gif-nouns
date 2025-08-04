// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

/**
 * @title AnimatedNounsNFT
 * @dev NFT contract for minting animated Nouns created with GIF Nouns Studio
 * @custom:security-contact security@gifnouns.com
 */
contract AnimatedNounsNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;
    
    // Minting price in ETH
    uint256 public mintPrice = 0.01 ether;
    
    // Maximum supply
    uint256 public maxSupply = 10000;
    
    // Base URI for metadata
    string private _baseTokenURI;
    
    // Events
    event AnimatedNounMinted(
        uint256 indexed tokenId,
        address indexed owner,
        string gifUrl,
        string noggleColor,
        string eyeAnimation
    );
    
    event MintPriceUpdated(uint256 newPrice);
    event BaseURIUpdated(string newBaseURI);

    constructor(
        string memory name,
        string memory symbol,
        string memory baseTokenURI
    ) ERC721(name, symbol) Ownable(msg.sender) {
        _baseTokenURI = baseTokenURI;
    }

    /**
     * @dev Mint a new animated Noun NFT
     * @param gifUrl The URL of the animated GIF
     * @param noggleColor The noggle color used
     * @param eyeAnimation The eye animation used
     * @param title The title of the animated Noun
     */
    function mintAnimatedNoun(
        string memory gifUrl,
        string memory noggleColor,
        string memory eyeAnimation,
        string memory title
    ) external payable {
        require(msg.value >= mintPrice, "Insufficient payment");
        require(_tokenIds.current() < maxSupply, "Max supply reached");
        
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();
        
        // Create metadata
        string memory metadata = _createMetadata(
            gifUrl,
            noggleColor,
            eyeAnimation,
            title
        );
        
        // Mint the NFT
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, metadata);
        
        emit AnimatedNounMinted(
            newTokenId,
            msg.sender,
            gifUrl,
            noggleColor,
            eyeAnimation
        );
    }

    /**
     * @dev Create metadata JSON for the NFT
     */
    function _createMetadata(
        string memory gifUrl,
        string memory noggleColor,
        string memory eyeAnimation,
        string memory title
    ) internal pure returns (string memory) {
        return string(abi.encodePacked(
            'data:application/json;base64,',
            _base64Encode(bytes(string(abi.encodePacked(
                '{"name":"', title, '",',
                '"description":"An animated Noun created with GIF Nouns Studio",',
                '"image":"', gifUrl, '",',
                '"animation_url":"', gifUrl, '",',
                '"external_url":"https://gifnouns.freezerverse.com",',
                '"attributes":[',
                '{"trait_type":"Noggle Color","value":"', noggleColor, '"},',
                '{"trait_type":"Eye Animation","value":"', eyeAnimation, '"},',
                '{"trait_type":"Collection","value":"GIF Nouns Collective"},',
                '{"trait_type":"Creator","value":"GIF Nouns Studio"}',
                '],',
                '"properties":{',
                '"files":[{"type":"image/gif","uri":"', gifUrl, '"}],',
                '"category":"image"',
                '}',
                '}'
            ))))
        ));
    }

    /**
     * @dev Base64 encoding function
     */
    function _base64Encode(bytes memory data) internal pure returns (string memory) {
        string memory table = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
        uint256 len = data.length;
        if (len == 0) return "";
        
        uint256 encodedLen = 4 * ((len + 2) / 3);
        bytes memory result = new bytes(encodedLen);
        
        uint256 i = 0;
        uint256 j = 0;
        
        while (i < len) {
            uint256 a = i < len ? uint8(data[i++]) : 0;
            uint256 b = i < len ? uint8(data[i++]) : 0;
            uint256 c = i < len ? uint8(data[i++]) : 0;
            
            uint256 triple = (a << 16) + (b << 8) + c;
            
            result[j++] = bytes1(bytes(table)[triple >> 18 & 0x3F]);
            result[j++] = bytes1(bytes(table)[triple >> 12 & 0x3F]);
            result[j++] = bytes1(bytes(table)[triple >> 6 & 0x3F]);
            result[j++] = bytes1(bytes(table)[triple & 0x3F]);
        }
        
        // Adjust padding
        while (j > 0 && result[j - 1] == "=") {
            j--;
        }
        
        assembly {
            mstore(result, j)
        }
        
        return string(result);
    }

    /**
     * @dev Update minting price (owner only)
     */
    function updateMintPrice(uint256 newPrice) external onlyOwner {
        mintPrice = newPrice;
        emit MintPriceUpdated(newPrice);
    }

    /**
     * @dev Update base URI (owner only)
     */
    function updateBaseURI(string memory newBaseURI) external onlyOwner {
        _baseTokenURI = newBaseURI;
        emit BaseURIUpdated(newBaseURI);
    }

    /**
     * @dev Withdraw contract balance (owner only)
     */
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No balance to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    /**
     * @dev Get total supply
     */
    function totalSupply() external view returns (uint256) {
        return _tokenIds.current();
    }

    /**
     * @dev Get remaining supply
     */
    function remainingSupply() external view returns (uint256) {
        return maxSupply - _tokenIds.current();
    }

    // Override required functions
    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }
} 