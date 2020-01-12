export const data = {
    "binary": {
        "sections": [
            {
                "payload": {
                    "functions": [
                        {
                            "params": [],
                            "results": []
                        },
                        {
                            "params": [
                                "i32"
                            ],
                            "results": [
                                "i32"
                            ]
                        }
                    ]
                },
                "payloadHex": "0260000060017f017f",
                "sectionType": "Type"
            },
            {
                "payload": {
                    "functionsTypes": [
                        0,
                        1
                    ]
                },
                "payloadHex": "020001",
                "sectionType": "Function"
            },
            {
                "payload": {
                    "exports": [
                        {
                            "index": 1,
                            "kind": "Function",
                            "name": "multi"
                        }
                    ]
                },
                "payloadHex": "01056d756c74690001",
                "sectionType": "Export"
            },
            {
                "payload": {
                    "functions": [
                        {
                            "bytecodeHex": "0b",
                            "formattedOpcodes": " <0> end \n",
                            "functionSignature": "func_0():void",
                            "locals": [],
                            "name": "func_0",
                            "opcodes": [
                                {
                                    "blockType": 0,
                                    "depth": 0,
                                    "immediates": [],
                                    "index": 0,
                                    "opcode": {
                                        "code": 11,
                                        "immediates": [],
                                        "name": "end"
                                    }
                                }
                            ]
                        },
                        {
                            "bytecodeHex": "200004401000100010000b20000440051000100010000b2000047f100010004108051000100041090b0b",
                            "exportedName": "multi",
                            "formattedOpcodes": " <0> local.get 0x0\n <0> if 0x40\n   <1> call 0x0 [func_0]\n   <1> call 0x0 [func_0]\n   <1> call 0x0 [func_0]\n   <1> end \n <0> local.get 0x0\n <0> if 0x40\n   <1> else \n   <1> call 0x0 [func_0]\n   <1> call 0x0 [func_0]\n   <1> call 0x0 [func_0]\n   <1> end \n <0> local.get 0x0\n <0> if 0x7f\n   <1> call 0x0 [func_0]\n   <1> call 0x0 [func_0]\n   <1> i32.const 0x8\n   <1> else \n   <1> call 0x0 [func_0]\n   <1> call 0x0 [func_0]\n   <1> i32.const 0x9\n   <1> end \n <0> end \n",
                            "functionSignature": "func_1(i32):i32",
                            "locals": [],
                            "name": "func_1",
                            "opcodes": [
                                {
                                    "blockType": 0,
                                    "depth": 0,
                                    "immediates": [
                                        "0x0"
                                    ],
                                    "index": 0,
                                    "opcode": {
                                        "code": 32,
                                        "immediates": [
                                            {
                                                "type": 0
                                            }
                                        ],
                                        "name": "local.get"
                                    }
                                },
                                {
                                    "blockType": 0,
                                    "depth": 0,
                                    "immediates": [
                                        "0x40"
                                    ],
                                    "index": 1,
                                    "opcode": {
                                        "code": 4,
                                        "immediates": [
                                            {
                                                "type": 3
                                            }
                                        ],
                                        "name": "if"
                                    }
                                },
                                {
                                    "blockType": 0,
                                    "depth": 1,
                                    "immediates": [
                                        "0x0"
                                    ],
                                    "index": 2,
                                    "opcode": {
                                        "code": 16,
                                        "immediates": [
                                            {
                                                "type": 0
                                            }
                                        ],
                                        "name": "call"
                                    }
                                },
                                {
                                    "blockType": 0,
                                    "depth": 1,
                                    "immediates": [
                                        "0x0"
                                    ],
                                    "index": 3,
                                    "opcode": {
                                        "code": 16,
                                        "immediates": [
                                            {
                                                "type": 0
                                            }
                                        ],
                                        "name": "call"
                                    }
                                },
                                {
                                    "blockType": 0,
                                    "depth": 1,
                                    "immediates": [
                                        "0x0"
                                    ],
                                    "index": 4,
                                    "opcode": {
                                        "code": 16,
                                        "immediates": [
                                            {
                                                "type": 0
                                            }
                                        ],
                                        "name": "call"
                                    }
                                },
                                {
                                    "blockType": 0,
                                    "depth": 1,
                                    "immediates": [],
                                    "index": 5,
                                    "opcode": {
                                        "code": 11,
                                        "immediates": [],
                                        "name": "end"
                                    }
                                },
                                {
                                    "blockType": 0,
                                    "depth": 0,
                                    "immediates": [
                                        "0x0"
                                    ],
                                    "index": 6,
                                    "opcode": {
                                        "code": 32,
                                        "immediates": [
                                            {
                                                "type": 0
                                            }
                                        ],
                                        "name": "local.get"
                                    }
                                },
                                {
                                    "blockType": 0,
                                    "depth": 0,
                                    "immediates": [
                                        "0x40"
                                    ],
                                    "index": 7,
                                    "opcode": {
                                        "code": 4,
                                        "immediates": [
                                            {
                                                "type": 3
                                            }
                                        ],
                                        "name": "if"
                                    }
                                },
                                {
                                    "blockType": 0,
                                    "depth": 1,
                                    "immediates": [],
                                    "index": 8,
                                    "opcode": {
                                        "code": 5,
                                        "immediates": [],
                                        "name": "else"
                                    }
                                },
                                {
                                    "blockType": 0,
                                    "depth": 1,
                                    "immediates": [
                                        "0x0"
                                    ],
                                    "index": 9,
                                    "opcode": {
                                        "code": 16,
                                        "immediates": [
                                            {
                                                "type": 0
                                            }
                                        ],
                                        "name": "call"
                                    }
                                },
                                {
                                    "blockType": 0,
                                    "depth": 1,
                                    "immediates": [
                                        "0x0"
                                    ],
                                    "index": 10,
                                    "opcode": {
                                        "code": 16,
                                        "immediates": [
                                            {
                                                "type": 0
                                            }
                                        ],
                                        "name": "call"
                                    }
                                },
                                {
                                    "blockType": 0,
                                    "depth": 1,
                                    "immediates": [
                                        "0x0"
                                    ],
                                    "index": 11,
                                    "opcode": {
                                        "code": 16,
                                        "immediates": [
                                            {
                                                "type": 0
                                            }
                                        ],
                                        "name": "call"
                                    }
                                },
                                {
                                    "blockType": 0,
                                    "depth": 1,
                                    "immediates": [],
                                    "index": 12,
                                    "opcode": {
                                        "code": 11,
                                        "immediates": [],
                                        "name": "end"
                                    }
                                },
                                {
                                    "blockType": 0,
                                    "depth": 0,
                                    "immediates": [
                                        "0x0"
                                    ],
                                    "index": 13,
                                    "opcode": {
                                        "code": 32,
                                        "immediates": [
                                            {
                                                "type": 0
                                            }
                                        ],
                                        "name": "local.get"
                                    }
                                },
                                {
                                    "blockType": 0,
                                    "depth": 0,
                                    "immediates": [
                                        "0x7f"
                                    ],
                                    "index": 14,
                                    "opcode": {
                                        "code": 4,
                                        "immediates": [
                                            {
                                                "type": 3
                                            }
                                        ],
                                        "name": "if"
                                    }
                                },
                                {
                                    "blockType": 0,
                                    "depth": 1,
                                    "immediates": [
                                        "0x0"
                                    ],
                                    "index": 15,
                                    "opcode": {
                                        "code": 16,
                                        "immediates": [
                                            {
                                                "type": 0
                                            }
                                        ],
                                        "name": "call"
                                    }
                                },
                                {
                                    "blockType": 0,
                                    "depth": 1,
                                    "immediates": [
                                        "0x0"
                                    ],
                                    "index": 16,
                                    "opcode": {
                                        "code": 16,
                                        "immediates": [
                                            {
                                                "type": 0
                                            }
                                        ],
                                        "name": "call"
                                    }
                                },
                                {
                                    "blockType": 0,
                                    "depth": 1,
                                    "immediates": [
                                        "0x8"
                                    ],
                                    "index": 17,
                                    "opcode": {
                                        "code": 65,
                                        "immediates": [
                                            {
                                                "type": 1
                                            }
                                        ],
                                        "name": "i32.const"
                                    }
                                },
                                {
                                    "blockType": 0,
                                    "depth": 1,
                                    "immediates": [],
                                    "index": 18,
                                    "opcode": {
                                        "code": 5,
                                        "immediates": [],
                                        "name": "else"
                                    }
                                },
                                {
                                    "blockType": 0,
                                    "depth": 1,
                                    "immediates": [
                                        "0x0"
                                    ],
                                    "index": 19,
                                    "opcode": {
                                        "code": 16,
                                        "immediates": [
                                            {
                                                "type": 0
                                            }
                                        ],
                                        "name": "call"
                                    }
                                },
                                {
                                    "blockType": 0,
                                    "depth": 1,
                                    "immediates": [
                                        "0x0"
                                    ],
                                    "index": 20,
                                    "opcode": {
                                        "code": 16,
                                        "immediates": [
                                            {
                                                "type": 0
                                            }
                                        ],
                                        "name": "call"
                                    }
                                },
                                {
                                    "blockType": 0,
                                    "depth": 1,
                                    "immediates": [
                                        "0x9"
                                    ],
                                    "index": 21,
                                    "opcode": {
                                        "code": 65,
                                        "immediates": [
                                            {
                                                "type": 1
                                            }
                                        ],
                                        "name": "i32.const"
                                    }
                                },
                                {
                                    "blockType": 0,
                                    "depth": 1,
                                    "immediates": [],
                                    "index": 22,
                                    "opcode": {
                                        "code": 11,
                                        "immediates": [],
                                        "name": "end"
                                    }
                                },
                                {
                                    "blockType": 0,
                                    "depth": 0,
                                    "immediates": [],
                                    "index": 23,
                                    "opcode": {
                                        "code": 11,
                                        "immediates": [],
                                        "name": "end"
                                    }
                                }
                            ]
                        }
                    ]
                },
                "payloadHex": "0202000b2b00200004401000100010000b20000440051000100010000b2000047f100010004108051000100041090b0b",
                "sectionType": "Code"
            },
            {
                "payloadHex": "046e616d65010801000564756d6d79020702000001010000"
            }
        ]
    },
    "dotCallGraph": "digraph \" \" {\n      graph [splines=ortho]\n      node[shape=box style=filled fillcolor=\"#2A2A2A\" fontname=\"Courier\"]\n      \n    N0_0 [label=func_0 fontcolor=\"#12cc12\"]\n        \n        N0_1 [label=multi fontcolor=\"#12cc12\"]\n        N0_1 -> N0_0\n        N1_0 [label=type_0_params__results_void fontcolor=\"#12cc12\"]\n        \n        N1_1 [label=type_1_params_i32_results_i32 fontcolor=\"#12cc12\"]\n        \n        \n    }",
    "functionsCfg": [
        "digraph \" \" {\n      graph [splines=ortho]\n      node[shape=box fillcolor=\"#2A2A2A\" style=filled fontname=\"Courier\"]\n\n      0 [label=\" <0> end \\l\"  fontcolor=\"#12cc12\"]\n      \n      \n\n    }",
        "digraph \" \" {\n      graph [splines=ortho]\n      node[shape=box fillcolor=\"#2A2A2A\" style=filled fontname=\"Courier\"]\n\n      0 [label=\" <0> local.get 0x0\\l <0> if 0x40\\l\"  fontcolor=\"#12cc12\"]\n      0 -> 2\n0 -> 6\n      2 [label=\" <1> call 0x0 [func_0]\\l <1> call 0x0 [func_0]\\l <1> call 0x0 [func_0]\\l <1> end \\l\"  fontcolor=\"#12cc12\"]\n      2 -> 6\n      6 [label=\" <0> local.get 0x0\\l <0> if 0x40\\l\"  fontcolor=\"#12cc12\"]\n      6 -> 8\n6 -> 9\n      8 [label=\" <1> else \\l\"  fontcolor=\"#12cc12\"]\n      8 -> 9\n      9 [label=\" <1> call 0x0 [func_0]\\l <1> call 0x0 [func_0]\\l <1> call 0x0 [func_0]\\l <1> end \\l\"  fontcolor=\"#12cc12\"]\n      9 -> 13\n      13 [label=\" <0> local.get 0x0\\l <0> if 0x7f\\l\"  fontcolor=\"#12cc12\"]\n      13 -> 15\n13 -> 19\n      15 [label=\" <1> call 0x0 [func_0]\\l <1> call 0x0 [func_0]\\l <1> i32.const 0x8\\l <1> else \\l\"  fontcolor=\"#12cc12\"]\n      15 -> 19\n      19 [label=\" <1> call 0x0 [func_0]\\l <1> call 0x0 [func_0]\\l <1> i32.const 0x9\\l <1> end \\l\"  fontcolor=\"#12cc12\"]\n      19 -> 23\n      23 [label=\" <0> end \\l\"  fontcolor=\"#12cc12\"]\n      \n      \n\n    }"
    ]
}
